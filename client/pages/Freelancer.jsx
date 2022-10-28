import React, { useContext, useEffect, useState } from "react";
import CategoriesTab from "../../components/molecules/CategoriesTab";
import Navbar from "../../components/molecules/Navbar";
import { Box, Heading, Text } from "@chakra-ui/react";
import { UtilitiesContext } from "../../context/UtilitiesProvider";

function App(props) {
  const { setIsFreelancer } = useContext(UtilitiesContext);

  function Feature({ title, desc, ...rest }) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" {...rest} minW="80" h="80">
        <Heading fontSize="xl">{title}</Heading>
        <Text mt={4}>{desc}</Text>
      </Box>
    );
  }
  useEffect(() => {
    setIsFreelancer(true);
  }, []);
  return (
    <>
      <Navbar />
      <CategoriesTab />
    </>
  );
}

export default App;
