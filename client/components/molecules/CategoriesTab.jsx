import React, { useContext, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Button,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import ClientTabContent from "./ClientTabContent";
import { FirebaseContext } from "../../context/FirebaseProvider";
import EditGigModal from "./EditGigModal";
import EditOrderModal from "./EditOrderModal";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import SellerTabContent from "./SellerTabContent";
import GigGrid from "./GigGrid";
import axios from "axios";
import GigCard from "../atoms/GigCard";
import OrderCard from "../atoms/OrderCard";

function CategoriesTab(props) {
  const { categories, getGigs, getOrders } = useContext(FirebaseContext);
  const { isFreelancer } = useContext(UtilitiesContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [displayData, setDisplayData] = useState([]);

  const [size, setSize] = useState("full");

  const handleSizeClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };
  const searchData = async (e) => {
    if (e.target.value.trim() == "") {
      setDisplayData([]);
      return;
    }
    let gigsOrOrders;
    isFreelancer
      ? (gigsOrOrders = await getOrders("timestamp", 30, null))
      : (gigsOrOrders = await getGigs("rating", 30, null));
    const fetchName = async (ipfsHash) => {
      let res = await axios.get(
        `https://${ipfsHash}.ipfs.nftstorage.link/metadata.json`
      );
      return res.data.name;
    };
    const allData = await Promise.all(
      gigsOrOrders.data.map(async (_) => {
        let name = await fetchName(_.ipfsHash);
        return { ..._, name };
      })
    );
    const filteredData = allData.filter((_) => _.name.includes(e.target.value));
    setDisplayData(filteredData);
    console.log("filtered,", displayData);
  };
  return (
    <>
      <Tabs isLazy isFitted>
        <TabList>
          {categories.map((_, i) => {
            return _.category != "_" && <Tab key={i}>{_.category}</Tab>;
          })}
        </TabList>

        <Flex
          p={3}
          bg={useColorModeValue("gray.100", "gray.900")}
          alignItems={"end"}
          pos={"sticky"}
          top={16}
          zIndex={10}
        >
          {isFreelancer ? (
            <EditGigModal isOpen={isOpen} onClose={onClose}>
              <Box
                bg={useColorModeValue("gray.400", "gray.900")}
                h={"120px"}
                mx={5}
                as={Button}
                onClick={() => handleSizeClick(size)}
              >
                Create Gig
              </Box>
            </EditGigModal>
          ) : (
            <Box p={3}>
              <EditOrderModal isOpen={isOpen} onClose={onClose}>
                <Box
                  bg={"gray.400"}
                  h={"120px"}
                  mx={5}
                  as={Button}
                  onClick={() => handleSizeClick(size)}
                >
                  Post Order
                </Box>
              </EditOrderModal>
            </Box>
          )}
          <InputGroup mx={5}>
            <InputLeftElement
              pointerEvents="none"
              children={<BsSearch color="gray.300" />}
            />
            <Input
              type="tel"
              placeholder="Search Gigs and orders"
              w={"xs"}
              onChange={searchData}
            />
          </InputGroup>
        </Flex>
        <TabPanels>
          {displayData.length ? (
            <SimpleGrid
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
              className="scroll"
              minChildWidth="2xs"
              spacing="40px"
              justifyContent={"center"}
            >
              {displayData.map((_, i) => {
                return (
                  <Box p={3} key={i}>
                    {isFreelancer ? (
                      <OrderCard content={_} />
                    ) : (
                      <GigCard content={_} />
                    )}
                  </Box>
                );
              })}
            </SimpleGrid>
          ) : (
            categories.map((_, i) => {
              return (
                <TabPanel key={i}>
                  {isFreelancer ? (
                    <SellerTabContent category={_} />
                  ) : (
                    <ClientTabContent category={_} />
                  )}
                </TabPanel>
              );
            })
          )}
        </TabPanels>
      </Tabs>
    </>
  );
}

export default CategoriesTab;
