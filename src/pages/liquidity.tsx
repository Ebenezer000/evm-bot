// pages/index.tsx
import { useState } from 'react';
import { Token } from '@uniswap/sdk-core';
import { useAccount, useConnect } from 'wagmi';
import { useUniswap } from '../hooks/useUniswap';

const Home = () => {
  const { address, isConnected } = useAccount();
  const { createLiquidityAndSwap, error, txHash } = useUniswap();

  const [tokenAAddress, setTokenAAddress] = useState('');
  const [tokenBAddress, setTokenBAddress] = useState('');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [fee, setFee] = useState(3000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tokenA = new Token(1, tokenAAddress, 18, 'TOKENA', 'Token A');
    const tokenB = new Token(1, tokenBAddress, 18, 'TOKENB', 'Token B');

    await createLiquidityAndSwap(tokenA, tokenB, amountA, amountB, fee);
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Uniswap V3 Liquidity and Swap</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Token A Address:</label>
              <input
                type="text"
                value={tokenAAddress}
                onChange={(e) => setTokenAAddress(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Token B Address:</label>
              <input
                type="text"
                value={tokenBAddress}
                onChange={(e) => setTokenBAddress(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Amount A:</label>
              <input
                type="text"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Amount B:</label>
              <input
                type="text"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Fee:</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="border p-2 w-full"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
              Create Liquidity and Swap
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {txHash && <p className="text-green-500 mt-2">Transaction Hash: {txHash}</p>}
          </form>
      </div>
  );
};

export default Home;
