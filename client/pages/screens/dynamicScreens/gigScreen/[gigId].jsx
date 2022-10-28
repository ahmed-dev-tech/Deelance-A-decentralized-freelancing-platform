import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Avatar,
  FormControl,
  Input,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import Navbar from "../../../../components/molecules/Navbar";
import { FirebaseContext } from "../../../../context/FirebaseProvider";
import axios from "axios";
import { UtilitiesContext } from "../../../../context/UtilitiesProvider";
import { ContractContext } from "../../../../context/ContractProvider";
import ImagePicker from "../../../../components/atoms/imagePicker";
import { useRef } from "react";
import { NFTStorageContext } from "../../../../context/NFTStorageProvider";
import HeadingText from "../../../../components/atoms/HeadingText";

function GigPage() {
  const router = useRouter();
  const { gigId } = router.query;

  const { fetchGigDetails, getUserProfile, updateGig, deleteGig } =
    useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);
  const { shortenText } = useContext(UtilitiesContext);
  const { address } = useContext(ContractContext);

  const [gigDetails, setGigDetails] = useState({});
  const [sellerInfo, setSellerInfo] = useState({});
  const [gigName, setGigName] = useState("");
  const [gigDescription, setGigDescription] = useState("");
  const [gigPic, setGigPic] = useState({});
  const [isAltered, setIsAltered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const inputFile = useRef(null);

  const fetchFile = (e) => {
    e.preventDefault();
    setGigPic(e.target.files[0]);
    setIsAltered(true);
  };
  const saveGig = async () => {
    try {
      setIsSaving(true);
      const res = await deployToNFTStorage(
        gigName || gigDetails.name,
        gigDescription || gigDetails.description,
        gigPic
      );
      await updateGig(gigId, { ipfsHash: res.ipnft });
    } catch (error) {
      throw error;
    }
    setIsSaving(false);
    setIsAltered(false);
  };
  const removeGig = async () => {
    setIsDeleting(true);
    await deleteGig(gigId);
    setIsDeleting(false);
  };
  const fetchSellerInfo = async (address) => {
    const res = await getUserProfile(address);
    let ipfsRes = await axios.get(
      `https://${res.ipfsHash}.ipfs.nftstorage.link/metadata.json`
    );
    const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
    setSellerInfo({
      name: ipfsRes.data.name,
      bio: ipfsRes.data.description,
      image: `https://${cid}.ipfs.nftstorage.link/${fileName}`,
    });
  };
  const prepareGigDetails = async () => {
    const firebaseRes = await fetchGigDetails(gigId);
    let ipfsRes = await axios.get(
      `https://${firebaseRes.ipfsHash}.ipfs.nftstorage.link/metadata.json`
    );
    const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
    setGigDetails({
      ...firebaseRes,
      name: ipfsRes.data.name,
      description: ipfsRes.data.description,
      image: `https://${cid}.ipfs.nftstorage.link/${fileName}`,
    });
  };
  useEffect(() => {
    gigId && prepareGigDetails();
  }, [gigId]);
  useEffect(() => {
    gigDetails.address && fetchSellerInfo(gigDetails.address);
  }, [gigDetails.address]);
  return (
    <>
      <Navbar />
      <Container maxW={"7xl"}>
        <HeadingText>Edit Gig</HeadingText>
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            {gigDetails.address == address ? (
              <>
                <FormControl>
                  <Input
                    value={gigName}
                    onChange={(e) => {
                      setIsAltered(true);
                      setGigName(e.target.value);
                    }}
                    placeholder={gigDetails.name}
                  />
                </FormControl>
                <FormControl>
                  <Textarea
                    value={gigDescription}
                    onChange={(e) => {
                      setIsAltered(true);
                      setGigDescription(e.target.value);
                    }}
                    placeholder={gigDetails.description}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
                >
                  <Text as={"span"} color={"blue.400"}>
                    {gigDetails.name}
                  </Text>
                </Heading>
                <Text color={"gray.500"}>{gigDetails.description}</Text>
              </>
            )}
          </Stack>
          <Flex
            flex={1}
            justify={"center"}
            align={"center"}
            position={"relative"}
            w={"full"}
          >
            {gigDetails.address == address ? (
              <Box width={"lg"}>
                <FormControl isRequired>
                  <Input
                    onChange={(e) => fetchFile(e)}
                    ref={inputFile}
                    type={"file"}
                    style={{ display: "none" }}
                  />
                </FormControl>
                <ImagePicker inputFile={inputFile} image={gigDetails.image} />
              </Box>
            ) : (
              <Box
                position={"relative"}
                height={"300px"}
                rounded={"2xl"}
                boxShadow={"2xl"}
                width={"full"}
                overflow={"hidden"}
              >
                <Image
                  alt={"Hero Image"}
                  fit={"contain"}
                  align={"center"}
                  w={"100%"}
                  h={"100%"}
                  src={gigDetails.image}
                />
              </Box>
            )}
          </Flex>
        </Stack>
        <HeadingText>All Bidders</HeadingText>

        <Stack p={3} maxW={"lg"}></Stack>
        <HeadingText>Projects</HeadingText>
        <HStack></HStack>
        {gigDetails.address == address ? (
          <HStack pos="fixed" bottom="10" right="10">
            <Button
              isDisabled={!isAltered}
              isLoading={isSaving}
              onClick={saveGig}
            >
              Save
            </Button>
            <Button isLoading={isDeleting} onClick={removeGig}>
              Delete
            </Button>
          </HStack>
        ) : (
          <Box
            rounded={"2xl"}
            boxShadow={"2xl"}
            overflow={"hidden"}
            bgColor={"gray.100"}
            pos="fixed"
            bottom="10"
            right="10"
            p={"2"}
            width={"fit-content"}
          >
            <Stack direction={"row"} spacing={4} align={"center"}>
              <Avatar src={sellerInfo.image} alt={"Author"} />
              <Stack direction={"row"} spacing={3} fontSize={"sm"}>
                <Stack direction={"column"} spacing={0} fontSize={"sm"}>
                  <Text fontWeight={600}>{sellerInfo.name}</Text>
                  <Text color={"gray.500"}>
                    {sellerInfo.bio && shortenText(sellerInfo.bio, 25)}
                  </Text>
                </Stack>
                <Link href={"/screens/App"}>
                  <Button
                    colorScheme={"teal"}
                    rounded={"full"}
                    size={"md"}
                    fontWeight={"normal"}
                    px={6}
                  >
                    Contact Seller
                  </Button>
                </Link>
                <Link href={"/screens/App"}>
                  <Button
                    colorScheme={"blue"}
                    rounded={"full"}
                    size={"md"}
                    fontWeight={"normal"}
                    px={6}
                  >
                    Order Seller
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Box>
        )}
      </Container>
    </>
  );
}

export default GigPage;
