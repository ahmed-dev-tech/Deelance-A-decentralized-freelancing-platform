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
  Center,
  Avatar,
  AvatarBadge,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import Select from "react-select";
import { useContext, useEffect, useRef, useState } from "react";
import { ContractContext } from "../../context/ContractProvider";
import { FirebaseContext } from "../../context/FirebaseProvider";
import { NFTStorageContext } from "../../context/NFTStorageProvider";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import { SmallCloseIcon } from "@chakra-ui/icons";

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
  const [displayImage, setDisplayImage] = useState("");
  const [orderCategory, setOrderCategory] = useState("");
  const [orderBudget, setOrderBudget] = useState({ value: 0, token: "native" });
  // Button isLoading values
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  // Ref
  const inputFile = useRef(null);
  // Form Functions
  const fetchFile = (e) => {
    e.preventDefault();
    const fileForUpload = e.target.files[0];
    setOrderFile(fileForUpload);
    const reader = new FileReader();
    reader.onload = (e) => {
      const readFile = e.target.result;
      readFile && setDisplayImage(readFile);
    };
    reader.readAsDataURL(fileForUpload);
  };
  const storeOrder = async (e) => {
    e.preventDefault();
    setIsSavingOrder(true);
    try {
      const res = await deployToNFTStorage(
        orderOffer,
        orderDescription,
        orderFile
      );
      await createOrder(res.ipnft, orderCategory, address, orderBudget);
    } catch (error) {
      throw error;
    }
    setOrderOffer("");
    setOrderDescription("");
    setOrderFile({});
    setDisplayImage("");
    setOrderBudget({ value: 0, token: "native" });
    setIsSavingOrder(false);
  };
  const discardChanges = () => {
    setOrderOffer("");
    setOrderDescription("");
    setOrderFile({});
    setDisplayImage("");
    setOrderBudget({ value: 0, token: "native" });
    onClose();
  };
  // JSX Elements
  useEffect(() => {
    setOrderCategory(categories[0]);
  }, [categories]);
  return (
    <>
      {children}
      <Modal onClose={onClose} size={"3xl"} isOpen={isOpen}>
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
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar size="xl" src={displayImage || ""}>
                    <AvatarBadge
                      as={IconButton}
                      size="sm"
                      rounded="full"
                      top="-10px"
                      colorScheme="red"
                      aria-label="remove Image"
                      onClick={() => {
                        setDisplayImage("");
                        setOrderFile({});
                      }}
                      icon={<SmallCloseIcon />}
                    />
                  </Avatar>
                </Center>
                <Center w="full">
                  <Button w="sm" onClick={() => inputFile.current.click()}>
                    Pick an image
                  </Button>
                  <Input
                    onChange={(e) => fetchFile(e)}
                    ref={inputFile}
                    type={"file"}
                    style={{ display: "none" }}
                  />
                </Center>
              </Stack>
            </FormControl>
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
            <Button colorScheme="red" onClick={discardChanges}>
              Discard
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default EditGigModal;
