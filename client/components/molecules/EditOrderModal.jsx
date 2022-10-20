import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import Select from "react-select";
import { useContext, useState } from "react";
import { ContractContext } from "../../context/ContractProvider";
import { FirebaseContext } from "../../context/FirebaseProvider";
import { NFTStorageContext } from "../../context/NFTStorageProvider";
import { UtilitiesContext } from "../../context/UtilitiesProvider";

function EditGigModal({ children, isOpen, onClose }) {
  // Context values
  const { categories, createOrder } = useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);
  const { address } = useContext(ContractContext);
  const { mumbaiTokens } = useContext(UtilitiesContext);
  // Form values
  const [orderOffer, setOrderOffer] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [orderFile, setOrderFile] = useState({});
  const [orderCID, setOrderCID] = useState("");
  const [orderCategory, setOrderCategory] = useState("");
  const [orderBudget, setOrderBudget] = useState({ value: 0, token: "native" });
  // Button isLoading values
  const [isDeployingNFT, setIsDeployingNFT] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  // Form Functions
  const fetchFile = (e) => {
    e.preventDefault();
    setOrderFile(e.target.files[0]);
  };
  const deployAndSetURI = async (e) => {
    e.preventDefault();
    setIsDeployingNFT(true);
    try {
      const res = await deployToNFTStorage(
        orderOffer,
        orderDescription,
        orderFile
      );
      console.log(res);
      setOrderCID(res.ipnft);
    } catch (error) {
      throw error;
    }
    setIsDeployingNFT(false);
  };
  const storeOrder = async (e) => {
    e.preventDefault();
    setIsSavingOrder(true);
    try {
      await createOrder(orderCID, orderCategory, address, orderBudget);
    } catch (error) {
      throw error;
    }
    setIsSavingOrder(false);
  };
  // JSX Elements
  return (
    <>
      {children}
      <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Post Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>In a sentence, state your order</FormLabel>
              <Input
                onChange={(e) => setOrderOffer(e.target.value)}
                placeholder="I need someone who kill Muzan without Nezuko's help "
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Describe order requirements.</FormLabel>
              <Textarea
                onChange={(e) => setOrderDescription(e.target.value)}
                placeholder="I need someone who may not be a demon slayer, but has a Nichirin sword, and knows a little KungFu, can get me Muzan's head"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Add a media file or url</FormLabel>
              <Input onChange={(e) => fetchFile(e)} height={65} type={"file"} />
            </FormControl>
            <Button
              mr={3}
              onClick={(e) => deployAndSetURI(e)}
              isLoading={isDeployingNFT}
            >
              Deploy to NFTStorage
            </Button>
            <FormControl isRequired>
              <FormLabel>Select Category</FormLabel>
              <Select
                onChange={(e) => {
                  setOrderCategory(e.value);
                }}
                className="basic-single"
                classNamePrefix="select"
                defaultValue={
                  categories.map((_) => {
                    return { value: _, label: _.toUpperCase() };
                  })[0]
                }
                isClearable={true}
                isSearchable={true}
                name="category"
                options={categories.map((_) => {
                  return { value: _, label: _.toUpperCase() };
                })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>What's your budget</FormLabel>
              <Flex justifyContent="left" alignContent="center">
                <Input
                  type={"number"}
                  width={"xs"}
                  mr={"3"}
                  onChange={(e) =>
                    setOrderBudget({ ...orderBudget, value: e.target.value })
                  }
                />
                <Select
                  onChange={(e) =>
                    setOrderBudget({ ...orderBudget, token: e.value })
                  }
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={mumbaiTokens[0]}
                  isClearable={true}
                  isSearchable={true}
                  name="category"
                  options={mumbaiTokens}
                />
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={(e) => storeOrder(e)}
              isLoading={isSavingOrder}
            >
              Save
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Discard
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default EditGigModal;
