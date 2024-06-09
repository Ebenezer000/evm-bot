import React, { Fragment, useEffect } from "react";
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

  return (
    <Fragment>
      <Meta />

      <div className="w-full flex flex-col">
        <form className="max-w-sm mx-auto">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Start Bot</button>
        </form>
      </div>
    </Fragment>
  );
}
