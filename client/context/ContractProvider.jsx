import React, { createContext, useEffect, useRef, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import deelance from "../abi/Deelance-address.json";
import deelanceABI from "../abi/Deelance.json";
import { useMoralis } from "react-moralis";

export const ContractContext = createContext();

function ContractProvider({ children }) {
  const { authenticate, isAuthenticated, isWeb3Enabled } = useMoralis();
  const web3ModalRef = useRef();
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");

  let myProvider;

  const data = {
    contract,
    address,
  };
  // contract address is rinkeby's
  const getProviderOrSigner = async (needSigner = false) => {
    // We need to gain access to the provider/signer from metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If the user is not connected to Mumbai, tell to switch to Mumbai

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5777) {
      window.alert("Please switch to the Mumbai network");
      throw new Error("Incorrect network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const getContract = async (withSigner = false) => {
    const provider = await getProviderOrSigner(withSigner);
    return new ethers.Contract(deelance.Deelance, deelanceABI.abi, provider);
  };

  const getAccounts = async () => {
    myProvider = await getProviderOrSigner(false);
    let accounts = await myProvider.send("eth_requestAccounts", []);
    return accounts[0];
  };

  myProvider &&
    myProvider.on("accountsChanged", function (accounts) {
      setAddress(accounts[0]);
    });

  useEffect(() => {
    if (isAuthenticated) {
      web3ModalRef.current = new Web3Modal({
        network: "ganache",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      getContract(true).then((res) => setContract(res));
      getAccounts().then((res) => setAddress(res));
    }
  }, [isAuthenticated]);

  return (
    <ContractContext.Provider value={data}>{children}</ContractContext.Provider>
  );
}

export default ContractProvider;