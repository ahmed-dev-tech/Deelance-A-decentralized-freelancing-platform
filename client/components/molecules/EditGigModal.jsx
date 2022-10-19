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
  const { categories, createGig } = useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);
  const { address } = useContext(ContractContext);
  const { mumbaiTokens } = useContext(UtilitiesContext);
  // Form values
  const [gigOffer, setGigOffer] = useState("");
  const [gigDescription, setGigDescription] = useState("");
  const [gigFile, setGigFile] = useState({});
  const [gigCID, setGigCID] = useState("");
  const [gigCategory, setGigCategory] = useState("");
  const [gigPrice, setGigPrice] = useState({ value: 0, token: "native" });
  // Button isLoading values
  const [isDeployingNFT, setIsDeployingNFT] = useState(false);
  const [isSavingGig, setIsSavingGig] = useState(false);
  // Form Functions
  const fetchFile = (e) => {
    e.preventDefault();
    setGigFile(e.target.files[0]);
  };
  const deployAndSetURI = async (e) => {
    e.preventDefault();
    setIsDeployingNFT(true);
    try {
      const res = await deployToNFTStorage(gigOffer, gigDescription, gigFile);
      console.log(res);
      setGigCID(res.ipnft);
    } catch (error) {
      throw error;
    }
    setIsDeployingNFT(false);
  };
  const storeGig = async (e) => {
    e.preventDefault();
    setIsSavingGig(true);
    try {
      await createGig(gigCID, gigCategory, address);
    } catch (error) {
      throw error;
    }
    setIsSavingGig(false);
  };
  // JSX Elements
  return (
    <>
      {children}
      <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Gig</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>In a sentence, state this gig's offer</FormLabel>
              <Input
                onChange={(e) => setGigOffer(e.target.value)}
                placeholder="I will kill Muzan without Nezuko's help "
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Describe what this gig does.</FormLabel>
              <Textarea
                onChange={(e) => setGigDescription(e.target.value)}
                placeholder="I may not be a demon slayer, but since I have a Nichirin sword, and know a little KungFu, I assure you that I can get you Muzan's head"
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
                  onChange={setGigPrice({ ...gigPrice, value: e.value })}
                />
                <Select
                  onChange={setGigPrice({ ...gigPrice, token: e.value })}
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
