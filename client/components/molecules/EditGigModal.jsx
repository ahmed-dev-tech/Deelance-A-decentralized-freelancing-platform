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
  Stack,
  Center,
  Avatar,
  IconButton,
  AvatarBadge,
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
  const { categories, createGig } = useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);
  const { address } = useContext(ContractContext);
  const { mumbaiTokens } = useContext(UtilitiesContext);
  // Form values
  const [gigOffer, setGigOffer] = useState("");
  const [gigDescription, setGigDescription] = useState("");
  const [gigFile, setGigFile] = useState({});
  const [displayImage, setDisplayImage] = useState("");
  const [gigCategory, setGigCategory] = useState("");
  const [gigPrice, setGigPrice] = useState({ value: 0, token: "native" });
  // Button isLoading values
  const [isSavingGig, setIsSavingGig] = useState(false);
  // Ref
  const inputFile = useRef(null);
  // Form Functions
  const fetchFile = (e) => {
    e.preventDefault();
    const fileForUpload = e.target.files[0];
    setGigFile(fileForUpload);
    const reader = new FileReader();
    reader.onload = (e) => {
      const readFile = e.target.result;
      readFile && setDisplayImage(readFile);
    };
    reader.readAsDataURL(fileForUpload);
  };
  const storeGig = async (e) => {
    e.preventDefault();
    setIsSavingGig(true);
    try {
      if (!(gigCategory && address && gigPrice)) {
        setIsSavingGig(false);
        return;
      }
      const res = await deployToNFTStorage(gigOffer, gigDescription, gigFile);
      await createGig(res.ipnft, gigCategory, address, gigPrice);
    } catch (error) {
      throw error;
    }
    setGigOffer("");
    setGigDescription("");
    setGigFile({});
    setDisplayImage("");
    setGigPrice({ value: 0, token: "native" });
    setIsSavingGig(false);
  };
  const discardChanges = () => {
    setGigOffer("");
    setGigDescription("");
    setGigFile({});
    setDisplayImage("");
    setGigPrice({ value: 0, token: "native" });
    onClose();
  };
  // JSX Elements
  useEffect(() => {
    setGigCategory(categories[0]);
  }, [categories]);
  return (
    <>
      {children}
      <Modal onClose={onClose} size={"3xl"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Gig</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>In a sentence, state this gig's offer</FormLabel>
              <Input
                value={gigOffer}
                onChange={(e) => setGigOffer(e.target.value)}
                placeholder="I will kill Muzan without Nezuko's help "
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Describe what this gig does.</FormLabel>
              <Textarea
                value={gigDescription}
                onChange={(e) => setGigDescription(e.target.value)}
                placeholder="I may not be a demon slayer, but since I have a Nichirin sword, and know a little KungFu, I assure you that I can get you Muzan's head"
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
                  setGigCategory(e.value);
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
              <FormLabel>What's your fee charge?</FormLabel>
              <Flex justifyContent="left" alignContent="center">
                <Input
                  type={"number"}
                  width={"xs"}
                  mr={"3"}
                  value={gigPrice}
                  onChange={(e) =>
                    setGigPrice({ ...gigPrice, value: e.target.value })
                  }
                />
                <Select
                  onChange={(e) => setGigPrice({ ...gigPrice, token: e.value })}
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
              onClick={(e) => storeGig(e)}
              isLoading={isSavingGig}
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
