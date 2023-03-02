import { useToast } from "@chakra-ui/react";
import React, { createContext, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { ContractContext } from "./ContractProvider";

export const UtilitiesContext = createContext();

function UtilitiesProvider({ children }) {
  const { chainId } = useContext(ContractContext);

  const toast = useToast();
  const [isFreelancer, setIsFreelancer] = useState(false);

  const polygonTokens = [
    {
      value: "native",
      label: "MATIC",
      icon: "https://polygonscan.com/token/images/matic_32.png",
    },
    {
      value: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      label: "DAI",
      icon: "https://polygonscan.com/token/images/mcdDai_32.png",
    },
    {
      value: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      label: "USDC",
      icon: "https://polygonscan.com/token/images/centre-usdc_32.png",
    },
    {
      value: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      label: "USDT",
      icon: "https://polygonscan.com/token/images/tether_32.png",
    },
  ];

  const shortenAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(38, 42)}`;
  };
  const shortenText = (text, characters) => {
    return text.length < characters
      ? text
      : `${text.slice(0, characters - 3)}...`;
  };
  const makeToast = (title, description, status) => {
    if (!toast.isActive(description)) {
      toast({
        title,
        description,
        status,
        duration: 9000,
        isClosable: true,
        id: description,
      });
    }
  };
  let tokens = {
    polygonTokens,
    // mumbaiTokens,
    // binanceTokens,
    // binanceTestTokens,
    // fantomTokens,
    // fantomTestTokens,
  };
  const data = {
    shortenAddress,
    shortenText,
    isFreelancer,
    setIsFreelancer,
    makeToast,
    tokens,
  };
  return (
    <UtilitiesContext.Provider value={data}>
      {children}
    </UtilitiesContext.Provider>
  );
}

export default UtilitiesProvider;
