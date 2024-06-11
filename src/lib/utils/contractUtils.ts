import { ethers } from "ethers";

// Initialize the contract
export function getContract(
  address: string,
  abi: ethers.Interface | ethers.InterfaceAbi,
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(address, abi, signerOrProvider);
}

export const RouterAddress: {[key: number]: string}  = {
  1: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  56: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2",
  137: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  10: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  42161: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  81457: "0x549FEB8c9bd4c12Ad2AB27022dA12492aC452B66",

  80001: "https://mumbai.polygonscan.com/token/",
  97: "https://testnet.bscscan.com/token/"
}