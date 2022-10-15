import React, { useContext, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
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
  const [size, setSize] = useState("full");

  const handleSizeClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };
  return (
    <>
      <Tabs isLazy isFitted>
        <TabList mb="1em">
          {categories.map((_, i) => {
            return _ != "_" && <Tab key={i}>{_}</Tab>;
          })}
        </TabList>
        {isFreelancer ? (
          <EditGigModal isOpen={isOpen} onClose={onClose}>
            <Button onClick={() => handleSizeClick(size)} m={4}>
              Create Gig
            </Button>
          </EditGigModal>
        ) : (
          <EditOrderModal isOpen={isOpen} onClose={onClose}>
            <Button onClick={() => handleSizeClick(size)} m={4}>
              Post Order
            </Button>
          </EditOrderModal>
        )}

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
