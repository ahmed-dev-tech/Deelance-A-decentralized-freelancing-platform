import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Textarea,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { FirebaseContext } from "../../context/FirebaseProvider";
import { NFTStorageContext } from "../../context/NFTStorageProvider";

function EditProfile({ props }) {
  const { editProfile } = useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);

  const [formValues, setFormValues] = useState({ name: "", bio: "", pic: {} });
  const [isSaving, setIsSaving] = useState(false);
  const [displayImage, setDisplayImage] = useState("");

  const inputFile = useRef(null);

  const fetchFile = (e) => {
    e.preventDefault();
    const fileForUpload = e.target.files[0];
    setFormValues({ ...formValues, pic: fileForUpload });
    const reader = new FileReader();
    reader.onload = (e) => {
      const readFile = e.target.result;
      readFile && setDisplayImage(readFile);
    };
    reader.readAsDataURL(fileForUpload);
  };
  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await deployToNFTStorage(name, bio, pic);
      editProfile(profileId, { ipfsHash: res.ipnft });
    } catch (error) {
      throw error;
    }
    setIsSaving(false);
  };
  useEffect(() => {
    setDisplayImage(props.profileDetails.image);
  }, [props.profileDetails]);
  return (
    <Flex w={{ base: "100%", md: "50%" }} align={"left"} justify={"left"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Edit Profile
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
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
                    setFormValues({ ...formValues, pic: {} });
                  }}
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => inputFile.current.click()}>
                Change Icon
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
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            onChange={(e) => {
              setFormValues({ ...formValues, name: e.target.value });
            }}
            placeholder={props.profileDetails.name || "Name"}
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Bio</FormLabel>
          <Textarea
            value={formValues.bio}
            onChange={(e) => {
              setFormValues({ ...formValues, bio: e.target.value });
            }}
            placeholder={props.profileDetails.bio || "Description"}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={saveProfile}
            isLoading={isSaving}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
export default EditProfile;
