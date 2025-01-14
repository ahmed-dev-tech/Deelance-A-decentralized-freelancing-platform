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
import { FirebaseContext } from "./FirebaseProvider";

export const ContractContext = createContext();

function ContractProvider({ children }) {
  const { isAuthenticated } = useMoralis();
  const web3ModalRef = useRef();

  const { addNewProject } = useContext(FirebaseContext);

  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [userDetailsOnChain, setUserDetailsOnChain] = useState([]);

  let chainId;
  // contract address is rinkeby's
  const getProviderOrSigner = async (needSigner = false) => {
    // We need to gain access to the provider/signer from metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If the user is not connected to Mumbai, tell to switch to Mumbai

    chainId = await web3Provider.getNetwork();
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
    console.log('address', address)
    console.log('accounts', accounts)
    window.alert(`Account has been changed to ${accounts[0]}`);
  };

  // Contract Interaction Functions
  const registerFreelancer = async () => {
    try {
      await contract.registerFreelancer({ gasPrice: 1000000000000 });
    } catch (error) {
      throw error;
    }
  };
  const registerClient = async () => {
    try {
      await contract.registerClient({ gasPrice: 1000000000000 });
    } catch (error) {
      throw error;
    }
  };

  const _getUserDetailsOnChain = async (address) => {
    try {
      const info = await contract.users(address);

      return info;
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
    }
  };
  const getProjectDetailsOnChain = async (projectId) => {
    try {
      const info = await contract.projects(projectId);

      return info;
    } catch (error) {
      throw error;
    }
  };
  const fundVault = async (amount, tokenAddress) => {
    try {
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
        await tokenContract.approve(contract.address, amount, {
          gasPrice: 100000000000,
        });
        info = await contract.fundWithERC20(amount, tokenAddress, {
          gasPrice: 100000000000,
        });
      }
    } catch (error) {
      throw error;
    }
  };
  const getVaultBalance = async (
    depositor = address,
    tokenAddress = "native"
  ) => {
    try {
      if (tokenAddress == "native") {
        const ethInVault = await contract.getEthInVault(depositor);
        return ethInVault;
      } else {
        const tokenInVault = await contract.getERC20InVault(
          depositor,
          tokenAddress
        );
        return tokenInVault;
      }
    } catch (error) {
      throw error;
    }
  };
  const addMilestone = async (
    projectId,
    deadline,
    isERC = false,
    token = address,
    amount = 0
  ) => {
    try {
      await contract.addMilestone(
        projectId,
        deadline,
        isERC,
        token,
        isERC ? amount : ethers.utils.parseEther(amount),
        {
          gasPrice: 17231855767,
        }
      );
    } catch (error) {
      throw error;
    }
  };
  const milestoneCompleted = async (projectId, milestoneId) => {
    try {
      await contract.milestoneCompleted(projectId, milestoneId);
    } catch (error) {
      throw error;
    }
  };
  const getMilestones = async (projectId) => {
    try {
      const res = await contract.getMilestones(projectId);
      return res;
    } catch (error) {
      throw error;
    }
  };
  // Listening to events
  contract?.once("StartedProject", (gig_orderId, projectId) => {
    try {
      const gig_orderIdString = ethers.utils.parseBytes32String(gig_orderId);
      console.log(gig_orderIdString);
      if (gig_orderIdString.slice(0, 5) == "order") {
        addNewProject(
          "orders",
          gig_orderIdString.slice(5),
          projectId.toString()
        );
      } else {
        addNewProject("gigs", gig_orderIdString, projectId.toString());
      }
    } catch (error) {
      throw error;
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
  }, [isAuthenticated,address]);

  useEffect(() => {
    address && contract &&
      _getUserDetailsOnChain(address).then((res) => setUserDetailsOnChain(res));
  }, [address,contract]);

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
    chainId,
    registerFreelancer,
    registerClient,
    userDetailsOnChain,
    startProject,
    getProjectDetailsOnChain,
    fundVault,
    getVaultBalance,
    addMilestone,
    getMilestones,
    milestoneCompleted,
  };
  return (
    <ContractContext.Provider value={data}>{children}</ContractContext.Provider>
  );
}

export default ContractProvider;
