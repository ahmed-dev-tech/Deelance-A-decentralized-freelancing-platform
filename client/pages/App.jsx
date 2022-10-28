import React, { useContext, useEffect, useState } from "react";
import CategoriesTab from "../../components/molecules/CategoriesTab";
import Navbar from "../../components/molecules/Navbar";
import { UtilitiesContext } from "../../context/UtilitiesProvider";

function App(props) {
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
