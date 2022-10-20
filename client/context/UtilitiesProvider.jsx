import { useToast } from "@chakra-ui/react";
import React, { createContext, useState } from "react";

export const UtilitiesContext = createContext();

function UtilitiesProvider({ children }) {
  const toast = useToast();
  const [isFreelancer, setIsFreelancer] = useState(false);
  const mumbaiTokens = [
    { value: "native", label: "MATIC" },
    { value: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", label: "DAI" },
    { value: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", label: "USDC" },
    { value: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", label: "USDT" },
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
    toast({ title, description, status, duration: 9000, isClosable: true });
  };
  const data = {
    shortenAddress,
    shortenText,
    isFreelancer,
    setIsFreelancer,
    mumbaiTokens,
    makeToast,
  };
  return (
    <UtilitiesContext.Provider value={data}>
      {children}
    </UtilitiesContext.Provider>
  );
}

export default UtilitiesProvider;
