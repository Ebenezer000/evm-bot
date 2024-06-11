// hooks/useUniswap.ts
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useEthersSigner } from './useWagmi';
import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { abi as IUniswapV3FactoryABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as NonfungiblePositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json';
import { RouterAddress } from '@/lib/utils/contractUtils';

const UNISWAP_V3_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

export const useUniswap = () => {
  const { address, isConnected, chain} = useAccount();
  const signer  = useEthersSigner();
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [routerAddrss, setRouter] = useState<string>("");

  const RouterSetter = () => {
    const explorer = RouterAddress[chain?.id!]
    setRouter(explorer);
  };

  useEffect(() => {
    RouterSetter();
  }, [chain?.id]);

  const createLiquidityAndSwap = async (tokenA: Token, tokenB: Token, amountA: string, amountB: string, fee: number) => {
    try {
      if (!signer) throw new Error('Wallet not connected');

      const provider = signer.provider;

      const factoryContract = new ethers.Contract(UNISWAP_V3_FACTORY_ADDRESS, IUniswapV3FactoryABI, signer);
      const positionManagerContract = new ethers.Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, NonfungiblePositionManagerABI, signer);

      // Check if the pool exists
      const poolAddress = await factoryContract.getPool(tokenA.address, tokenB.address, fee);
      if (poolAddress === "0x0000000000000000000000000000000000000000") {
        console.log('Pool does not exist, creating a new pool...');
        await positionManagerContract.createAndInitializePoolIfNecessary(tokenA.address, tokenB.address, fee, '30000000000000000000000000000000'); // sqrtPriceX96 for 1:1 ratio
      }

      // Approve tokens
      const tokenAContract = new ethers.Contract(tokenA.address, ['function approve(address spender, uint value) external returns (bool)'], signer);
      const tokenBContract = new ethers.Contract(tokenB.address, ['function approve(address spender, uint value) external returns (bool)'], signer);

      await tokenAContract.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, amountA);
      await tokenBContract.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, amountB);

      // Add liquidity
      const params = {
        token0: tokenA.address,
        token1: tokenB.address,
        fee: fee,
        tickLower: -887220, // Minimum tick
        tickUpper: 887220,  // Maximum tick
        amount0Desired: amountA,
        amount1Desired: amountB,
        amount0Min: 0,
        amount1Min: 0,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
      };

      const tx = await positionManagerContract.mint(params);
      await tx.wait();
      console.log('Liquidity added:', tx.hash);
      setTxHash(tx.hash);

      // Swap tokens
      const router = new ethers.Contract(
        '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Uniswap V3 SwapRouter address
        [
          'function exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160)) external payable returns (uint256 amountOut)'
        ],
        signer
      );

      const amountIn = amountB;
      const amountOutMin = '0'; // Set your minimum amount out
      const paramsSwap = {
        tokenIn: tokenB.address,
        tokenOut: tokenA.address,
        fee: fee,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        amountIn: amountIn,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0
      };

      const swapTx = await router.exactInputSingle(paramsSwap);
      await swapTx.wait();
      console.log('Swap completed:', swapTx.hash);
      setTxHash(swapTx.hash);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  return { createLiquidityAndSwap, error, txHash };
};
