import React, { useContext, useEffect, useState } from "react";
import CategoriesTab from "../../components/molecules/CategoriesTab";
import Navbar from "../../components/molecules/Navbar";
import { ContractContext } from "../../context/ContractProvider";
import { UtilitiesContext } from "../../context/UtilitiesProvider";

function App(props) {
  const { address } = useContext(ContractContext);
  const { setIsFreelancer } = useContext(UtilitiesContext);

  useEffect(() => {
    setIsFreelancer(false);
  }, []);
  return (
    <>
      <Navbar />
      <CategoriesTab />
    </>
  );
}

export default App;
