import React, { createContext, useEffect, useRef, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import deelance from "../abi/Deelance-address.json";
import deelanceABI from "../abi/Deelance.json";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { UtilitiesContext } from "./UtilitiesProvider";
import { FirebaseContext } from "./FirebaseProvider";

export const ContractContext = createContext();

function ContractProvider({ children }) {
  const { authenticate, isAuthenticated, isWeb3Enabled } = useMoralis();
  const web3ModalRef = useRef();

  const { makeToast } = useContext(UtilitiesContext);
  const { addToFirebaseArray } = useContext(FirebaseContext);

  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [userDetailsOnChain, setUserDetailsOnChain] = useState([]);

  let myProvider;

  // contract address is rinkeby's
  const getProviderOrSigner = async (needSigner = false) => {
    // We need to gain access to the provider/signer from metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If the user is not connected to Mumbai, tell to switch to Mumbai

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 1337) {
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
  const handleAccountChange = (accounts) => {
    setAddress(accounts[0]);
    makeToast(
      "Metamask success",
      `Account has successfully been changed to ${accounts[0]}`,
      "success"
    );
  };

  // Contract Interaction Functions
  const registerFreelancer = async () => {
    try {
      await contract.registerFreelancer({ gasPrice: 1000000000000 });
      makeToast(
        "Contract Success",
        "Successfully registered Freelancer on chain",
        "success"
      );
    } catch (error) {
      makeToast(
        "Contract Error",
        "An Unknown error occurred while registering this address as a freelancer",
        "error"
      );
    }
  };
  const registerClient = async () => {
    try {
      await contract.registerClient({ gasPrice: 1000000000000 });
      makeToast(
        "Contract Success",
        "Successfully registered Client on chain",
        "success"
      );
    } catch (error) {
      makeToast(
        "Contract Error",
        "An Unknown error occurred while registering this address as a client",
        "error"
      );
    }
  };
  const _getUserDetailsOnChain = async (address) => {
    try {
      const info = await contract.users(address, { gasLimit: 50000 });
      makeToast(
        "Contract Success",
        "Successfully retrieved user details",
        "success"
      );
      return info;
    } catch (error) {
      makeToast(
        "Contract Error",
        "An Unknown error occurred while retrieving user details",
        "error"
      );
      return [];
    }
  };
  const startProject = async (gig_orderId, address) => {
    console.log(ethers.utils.formatBytes32String(`order${gig_orderId}`));
    try {
      await contract.startProject(
        ethers.utils.formatBytes32String(gig_orderId),
        address,
        {
          gasPrice: 1000000000000,
        }
      );
      makeToast("Contract Success", "Successfully started project", "success");
    } catch (error) {
      console.log(error);
      makeToast(
        "Contract Error",
        "An Unknown error occurred while starting project with freelancer provided",
        "error"
      );
    }
  };
  // Listening to events
  contract?.on("StartedProject", (gig_orderId, projectId) => {
    try {
      const gig_orderIdString = ethers.utils.parseBytes32String(gig_orderId);
      console.log(gig_orderIdString);
      if (gig_orderIdString.slice(0, 5) == "order") {
        addToFirebaseArray(
          "orders",
          gig_orderIdString.slice(5),
          "projectsArray",
          projectId.toString()
        );
      } else {
        addToFirebaseArray(
          "gigs",
          gig_orderIdString,
          "projectsArray",
          projectId.toString()
        );
      }
      makeToast(
        "Firebase Success",
        "Successfully added projectId to firebase",
        "success"
      );
    } catch (error) {
      makeToast(
        "Firebase Error",
        "An Unknown error occurred while trying to add projectId to firebase",
        "error"
      );
    }
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

  useEffect(() => {
    address &&
      _getUserDetailsOnChain(address).then((res) => setUserDetailsOnChain(res));
  }, [address]);
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      };
    }
  });
  const data = {
    contract,
    address,
    registerFreelancer,
    registerClient,
    userDetailsOnChain,
    startProject,
  };
  return (
    <ContractContext.Provider value={data}>{children}</ContractContext.Provider>
  );
}

export default ContractProvider;
