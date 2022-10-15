import React, { createContext, useState } from "react";

export const UtilitiesContext = createContext();

function UtilitiesProvider({ children }) {
  //TODO: isFreelancer global state
  const [isFreelancer, setIsFreelancer] = useState(false);
  const mumbaiTokens = [
    { value: "native", label: "MATIC" },
    { value: 0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa, label: "DAI" },
    { value: 0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa, label: "USDC" },
    { value: 0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa, label: "USDT" },
    { value: 0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa, label: "DAI" },
  ];
  const shortenAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(38, 42)}`;
  };
  const shortenText = (text, characters) => {
    return text.length < characters
      ? text
      : `${text.slice(0, characters - 3)}...`;
  };
  const data = { shortenAddress, shortenText, isFreelancer, setIsFreelancer };
  return (
    <UtilitiesContext.Provider value={data}>
      {children}
    </UtilitiesContext.Provider>
  );
}

export default UtilitiesProvider;
