import { useState, useEffect } from "react";
// Importing Next
import Image from "next/image";
import Link from "next/link";
// Importing RainbowKit
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ThemeSwitch from '../components/ThemeSwitch/index';

export default function NavBar() {
  const [isNavVisible, setNavVisibility] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  return (
    <header className="px-4 xs:px-6 md:px-8 bg-02 shadow-lg dark:bg-09">
      <nav className="flex items-center justify-between mx-auto py-5">

        <div className="contents justify-self-end py-5 px-8 h-8 cursor-pointer md:hidden">
          <div
            onClick={toggleNav}
            className={`hamburger flex flex-col justify-between w-6 h-5 cursor-pointer ${
              isNavVisible ? "open" : ""
            }`}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
        <div className={` md:block md:max-w-header-nav ${
            isNavVisible ? "block" : "hidden"
          }`}>
          <ul className="p-0 mt-0 mb-0 flex flex-col w-full md:m-0 md:flex-row md:items-center md:justify-between">
            <li className="flex items-center justify-center">
              <a
                className="block py-2 px-2 text-black text-lg font-medium dark:text-white"
                href="/"
                rel="noreferrer"
              >
                Create Token
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a
                className="block py-2 px-2 text-black text-lg font-medium dark:text-white"
                href="/distribute"
                rel="noreferrer"
              >
                Distribute Token
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a
                className="block py-2 px-2 text-black text-lg font-medium dark:text-white"
                href="/liquidity"
                rel="noreferrer"
              >
                Create Liquidity
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a
                className="block py-2 px-2 text-black text-lg font-medium dark:text-white"
                href="/bot"
                rel="noreferrer"
              >
                Start Bot
              </a>
            </li>
          </ul>
        </div>

        <div
          className={`flex flex-col md:block md:max-w-header-nav ${
            isNavVisible ? "block" : "hidden"
          }`}
        >
            <div className="block items-center justify-center">
              <ConnectButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
