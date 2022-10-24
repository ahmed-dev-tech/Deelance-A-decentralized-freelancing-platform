import React, { createContext, useEffect, useRef, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import deelance from "../abi/Deelance-address.json";
import deelanceABI from "../abi/Deelance.json";
import dai from "../abi/polygonTokens/DaiToken.json";
import usdc from "../abi/polygonTokens/UsdcToken.json";
import usdt from "../abi/polygonTokens/UsdtToken.json";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { UtilitiesContext } from "./UtilitiesProvider";
import { FirebaseContext } from "./FirebaseProvider";

const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

export const ContractContext = createContext();

function ContractProvider({ children }) {
  const { authenticate, isAuthenticated, isWeb3Enabled } = useMoralis();
  const web3ModalRef = useRef();

  const { makeToast } = useContext(UtilitiesContext);
  const { addToFirebaseArray } = useContext(FirebaseContext);

  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [userDetailsOnChain, setUserDetailsOnChain] = useState([]);

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

  const getContract = async (address, abi) => {
    let mySigner = await getProviderOrSigner(true);
    return new ethers.Contract(address, abi, mySigner);
  };

  const getAccounts = async () => {
    let myProvider = await getProviderOrSigner(false);
    setProvider(myProvider);
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
      const info = await contract.users(address);
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
  const getProjectDetailsOnChain = async (projectId) => {
    try {
      const info = await contract.projects(projectId);
      makeToast(
        "Contract Success",
        "Successfully retrieved project details",
        "success"
      );
      return info;
    } catch (error) {
      console.log(error);
      makeToast(
        "Contract Error",
        "An Unknown error occurred while retrieving project details",
        "error"
      );
      return [];
    }
  };
  const fundVault = async (amount, tokenAddress) => {
    try {
      console.log(amount, tokenAddress);
      let info;
      if (tokenAddress == "native") {
        info = await provider.getSigner().sendTransaction({
          to: contract.address,
          value: ethers.utils.parseEther(amount),
          gasPrice: 1000000000000,
        });
      } else {
        let tokenAbi, tokenContract;
        switch (tokenAddress) {
          case dai.address:
            tokenAbi = dai.abi;
            break;
          case usdc.address:
            tokenAbi = usdc.abi;
            break;
          case usdt.address:
            tokenAbi = usdt.abi;
            break;
          default:
            break;
        }
        tokenContract = await getContract(tokenAddress, tokenAbi);
        console.log("here1");
        await tokenContract.approve(contract.address, amount, {
          gasPrice: 100000000000,
        });
        console.log("here2");
        info = await contract.fundWithERC20(amount, tokenAddress, {
          gasPrice: 100000000000,
        });
        console.log(provider.getSigner(), info);
      }
    } catch (error) {
      console.log(error);
      makeToast(
        "Contract Error",
        "An Unknown error occurred while funding vault",
        "error"
      );
    }
  };
  // Listening to events
  contract?.once("StartedProject", (gig_orderId, projectId) => {
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
      getContract(deelance.Deelance, deelanceABI.abi).then((res) =>
        setContract(res)
      );
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
    getProjectDetailsOnChain,
    fundVault,
  };
  return (
    <ContractContext.Provider value={data}>{children}</ContractContext.Provider>
  );
}

export default ContractProvider;
