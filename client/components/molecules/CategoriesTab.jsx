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
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import ClientTabContent from "./ClientTabContent";
import { FirebaseContext } from "../../context/FirebaseProvider";
import EditGigModal from "./EditGigModal";
import EditOrderModal from "./EditOrderModal";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import SellerTabContent from "./SellerTabContent";

function CategoriesTab(props) {
  const { categories } = useContext(FirebaseContext);
  const { isFreelancer } = useContext(UtilitiesContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchValue, setSearchValue] = useState("");

  const [size, setSize] = useState("full");

  const handleSizeClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };
  return (
    <>
      <Tabs isLazy isFitted>
        <TabList>
          {categories.map((_, i) => {
            return _.category != "_" && <Tab key={i}>{_.category}</Tab>;
          })}
        </TabList>

        <Flex p={3} bg={"gray.100"} alignItems={"end"}>
          {isFreelancer ? (
            <EditGigModal isOpen={isOpen} onClose={onClose}>
              <Box
                bg={"gray.400"}
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
                  color={"aqua"}
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <TabPanels>
          {categories.map((_, i) => {
            return (
              <TabPanel key={i}>
                {isFreelancer ? (
                  <SellerTabContent category={_} />
                ) : (
                  <ClientTabContent category={_} />
                )}
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </>
  );
}

export default CategoriesTab;
