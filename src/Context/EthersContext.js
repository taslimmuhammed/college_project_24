import { ethers } from "ethers";
import { createContext, useState, useEffect } from "react";
import { abi } from "../Utils/abi";
import { useNavigate } from "react-router-dom";

export const EthersContext = createContext(null);
const { ethereum } = window;
if (!ethereum) alert("Please install metamask to use the application");

export default function Ethers({ children }) {
  const contractAddress = "0x1E1AB99a66E1CCb2873405AC7c9BA80a82ce475C";
  const [currentAccount, setCurrentAccount] = useState(null);
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const [Contract, setContract] = useState(
    new ethers.Contract(contractAddress, abi, signer)
  );
  //const navigate = useNavigate();

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        alert("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };


  const createIP = async (uri,name) => {
    try {
      const contract = getContract();
      let res = await contract.createIP(uri,name);
      await res.wait();
      alert(`Succefully created IP`);
      return 2;
    } catch (e) {
      console.log(e);
    }
  };

  const putforSell = async (id, price) => {
    try {
      const contract = getContract();
      let res = await contract.putforSell(id, price); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const putforLend = async (id, price) => {
    try {
      const contract = getContract();
      let res = await contract.putforLend(id, price); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const changeBuyingPrice = async (id, price) => {
    try {
      const contract = getContract();
      let res = await contract.changeBuyingPrice(id, price); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const changeLendingPrice = async (id, price) => {
    try {
      const contract = getContract();
      let res = await contract.changeLendingPrice(id, price); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const buy = async (id) => {
    try {
      const contract = getContract();
      let res = await contract.buy(id); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const lend = async (id, months) => {
    try {
      const contract = getContract();
      let res = await contract.lend(id, months); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const transferOwnerShip = async (id, wallet) => {
    try {
      const contract = getContract();
      let res = await contract.transferOwnerShip(id, wallet); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const withdrwLend = async (id) => {
    try {
      const contract = getContract();
      let res = await contract.withdrwLend(id); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };
  const withdrwBuy = async (id) => {
    try {
      const contract = getContract();
      let res = await contract.withdrwBuy(id); //convert
      await res.wait();
      alert(`Transaction Succeful`);
    } catch (e) {
      console.log(e);
    }
  };

  //Reading Functions------------------------------------------------------------------------------------
  const checkLendablity = async (id) => {
    try {
      const contract = getContract();
      let res = await contract.checkLendablity(id);
      return res;
    } catch (e) {
      console.log(e);
    }
  };
  const checkBuyablity = async (id) => {
    try {
      const contract = getContract();
      let res = await contract.checkBuyablity(id);
      return res;
    } catch (e) {
      console.log(e);
    }
  };
  const checkIPOwner = async (id) => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let res = await contract.checkIPOwner(id, account);
      return res;
    } catch (e) {
      console.log(e);
    }
  };
  const getBuyingMarket = async (index) => {
    try {
      const contract = getContract();
      let res = await contract.getBuyingMarket((index - 1) * 10, index * 10); //convert
      return res;
    } catch (e) {
      console.log(e);
    }
  };
  const getLendingMarket = async (index) => {
    try {
      const contract = getContract();
      let res = await contract.getLendingMarket((index - 1) * 10, index * 10); //convert
      return res;
    } catch (e) {
      console.log(e);
    }
  };
  const getUserIPs = async () => {
    try {
      const contract = getContract();
      const account = await getWallet();
      let res = await contract.getUserIPs(account); //convert
      return res;
    } catch (e) {
      console.log(e);
    }
  };
  const getWallet = async () => {
    try {
      if (currentAccount == null) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        return account;
      } else return currentAccount;
    } catch (e) {
      alert(e);
    }
  };

  const getContract = () => {
    try {
      if (Contract == null) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
        return contract;
      } else return Contract;
    } catch (e) {
      alert(e);
      return null;
    }
  };

  // const getN = async () => {
  //   const chainId = 137 // Polygon Mainnet

  //   if (window.ethereum.networkVersion !== chainId) {
  //     try {
  //       await window.ethereum.request({
  //         method: 'wallet_switchEthereumChain',
  //         params: [{ chainId: "0x89" }]
  //       });
  //     } catch (err) {
  //       // This error code indicates that the chain has not been added to MetaMask
  //       if (err.code === 4902) {
  //         await window.ethereum.request({
  //           method: 'wallet_addEthereumChain',
  //           params: [
  //             {
  //               chainName: 'Polygon Mainnet',
  //               chainId: "0x89",
  //               nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
  //               rpcUrls: ['https://polygon-rpc.com/']
  //             }
  //           ]
  //         });
  //       }
  //     }
  //   }

  // }

  useEffect(() => {
    checkIfWalletIsConnect();

    //  getN();
  }, []);

  return (
    <EthersContext.Provider
      value={{
        connectWallet,
        currentAccount,
        checkIfWalletIsConnect,
        createIP,
        putforSell,
        putforLend,
        changeBuyingPrice,
        changeLendingPrice,
        buy,
        lend,
        transferOwnerShip,
        withdrwLend,
        withdrwBuy,
        checkLendablity,
        checkBuyablity,
        checkIPOwner,
        getBuyingMarket,
        getLendingMarket,
        getUserIPs,
        getWallet,
      }}
    >
      {children}
    </EthersContext.Provider>
  )
}