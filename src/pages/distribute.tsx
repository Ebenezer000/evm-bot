import React, { Fragment, useEffect, useState } from "react";
//Importing Hooks
import { useAccount } from "wagmi";
//Importing Components
import Meta from "@/components/Meta";
import ThemeSwitch from "@/components/ThemeSwitch";

export default function Home() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      console.log("Wallet address: ", address);
    } else {
      console.log("Not connected");
    }
  }, [address, isConnected]);

  const [formData, setFormData] = useState({
    tokenAddress: '',
    tokenAmount: '',
    baseAmount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
  
  return (
    <Fragment>
      <Meta />

      <div className="w-full flex flex-col">
        <form className="md:w-[30%] mx:w-[50%] mx-auto p-4 rounded shadow-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tokenAddress">
              Token Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tokenAddress"
              type="text"
              name="tokenAddress"
              value={formData.tokenAddress}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tokenAmount">
              List Of Addresses
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tokenAmount"
              type="text"
              name="tokenAmount"
              value={formData.tokenAmount}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-[#FF801F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline"
              type="submit"
            >
              Distribute
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
