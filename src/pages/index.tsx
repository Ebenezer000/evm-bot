import React, { Fragment, useEffect, useState } from "react";
import { encodeAbiParameters } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import Meta from "@/components/Meta";
import { tokenBytecode } from "@/Contracts/VolBytecode";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HiClipboardDocument, HiClipboardDocumentCheck } from "react-icons/hi2";

export default function Home() {
  const { address, isConnected, connector, chain } = useAccount();
  const [transactionHash, setTransactionHash] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [isDeployed, setIsDeployed] = useState(true);
  const [error, setError] = useState('');
  const [explorerUrl, setExplorerUrl] = useState<string>("");

  const [copied, SetCopied] = useState<boolean>(false)
  
  useEffect(() => {
    if (isConnected) {
      console.log("Wallet address: ", address);
    } else {
      console.log("Not connected");
    }
  }, [address, isConnected]);

  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: 0,
    decimal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Hooks
  const receipt = useWaitForTransactionReceipt({
    hash: transactionHash ? `${transactionHash}` as `0x${string}` : undefined,
  });


  function copyButton() {
    navigator.clipboard.writeText(`https://wasp-orpin.vercel.app/?ref=${address as string}`);
    SetCopied(true)
  }

  // Functions
  /**
   * @dev function that handles sending a transaction to the blockchain
   */
  const deployContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionHash('');
    setError('');

    console.group("deployContract");
    setIsloading(true);
    try {

      const provider = await connector?.getProvider() as any;

      // Based on constructor - constructor(string memory _greeting) {
      const encodedData = encodeAbiParameters(
        [{ name: "tokenName", type: "string" }, {name: "tokenSymbol", type: "string" }, {name: "initialSupply", type: "uint256" }],
        [`${formData.tokenName}`, `${formData.tokenSymbol}`, BigInt(formData.totalSupply)]
      );

      // Need slide(2) to remove 0x from encodedData at the beginning
      const fullByteCode = `${tokenBytecode}${encodedData.slice(2)}` as `0x${string}`;

      // Process trasaction
      const tx = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            data: fullByteCode,
          },
        ],
      });

      // Get the transaction hash
      setTransactionHash(tx);

      // Refetch wait for receipt
      receipt.refetch();
      setIsDeployed(true)
    } catch (error: any) {
      console.error(error?.message);
      console.error(error?.reason);
      console.error(error);
      setError(error?.message);
    }
    setIsloading(false);
    console.groupEnd();
  };
  
  return (
    <Fragment>
      <Meta />
      <div className="w-full flex flex-col">
        <form className="md:w-[45%] mx-auto p-4 rounded shadow-md " onSubmit={deployContract}>
          <div className="mb-4">
            <label className="block text-white-700 text-sm font-bold mb-2" htmlFor="tokenName">
              Token Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tokenName"
              type="text"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white-700 text-sm font-bold mb-2" htmlFor="tokenSymbol">
              Token Symbol
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tokenSymbol"
              type="text"
              name="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white-700 text-sm font-bold mb-2" htmlFor="totalSupply">
              Total Supply
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
              id="totalSupply"
              type= "number"
              name="totalSupply"
              value={formData.totalSupply}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-center">
            {isConnected?
                <button
                  className="bg-[#FF801F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Create Token
                </button>
                :
                <ConnectButton />
            }
            
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="p-6 rounded shadow-md text-center">
            <div className="mb-4 flex justify-center items-center">
              <div className="loader"></div>
              <p className=" ml-3 text-lg font-semibold">Deploying Contract...</p>
            </div>
          </div>
        </div>
      )}

      {isDeployed && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <div className="w-[60%] dark:bg-[#FF801F] bg-white dark:bg-opacity-60 p-6 rounded shadow-md text-center ">
            <div className="mb-4">
              <div>
                <h1>
                  Copy Token Address
                </h1>
                <div className="text-xl font-bold">
                  {receipt?.data?.contractAddress}
                  <span>
                    <button
                      onClick={copyButton}>
                        {copied?
                          <HiClipboardDocumentCheck size={30} className=" ml-1"/>:
                          <HiClipboardDocument size={30} className=" ml-1 "/>
                        }
                    </button>
                  </span>
                </div>
              </div>
              <div>
                <a
                  href="/distribute"
                  >
                  <button
                    className="mt-4 bg-green-500 text-white font-bold py-2 px-4 mx-1 rounded focus:outline-none focus:shadow-outline"
                  >
                    Distribute
                  </button>
                </a>
                
                <a
                  href={chain?.blockExplorers+"/token/"+receipt?.data?.contractAddress}
                >
                  <button
                    className="mt-4 bg-green-500 text-white  py-2 px-4 mx-1 rounded focus:outline-none focus:shadow-outline"
                  >
                    View Token
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <div className="mb-4">
              <p className="text-lg font-semibold text-red-600">Error: {error}</p>
              <button
                className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setError('')}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
