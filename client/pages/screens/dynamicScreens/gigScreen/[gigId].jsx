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
} from "@chakra-ui/react";
import Navbar from "../../../../components/molecules/Navbar";
import { FirebaseContext } from "../../../../context/FirebaseProvider";
import axios from "axios";
import { UtilitiesContext } from "../../../../context/UtilitiesProvider";

function GigPage(req, res) {
  const router = useRouter();
  const { gigId } = router.query;

  const { fetchGigDetails, getUserProfile } = useContext(FirebaseContext);
  const { shortenText } = useContext(UtilitiesContext);
  const [gigDetails, setGigDetails] = useState({});
  const [sellerInfo, setSellerInfo] = useState({});

  const fetchSellerInfo = async (address) => {
    const res = await getUserProfile(address);
    let ipfsRes = await axios.get(
      `https://${res.ipfsHash}.ipfs.ipfs-gateway.cloud/metadata.json`
    );
    const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
    setSellerInfo({
      name: ipfsRes.data.name,
      bio: ipfsRes.data.description,
      image: `https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`,
    });
  };
  const prepareGigDetails = async () => {
    const firebaseRes = await fetchGigDetails(gigId);
    let ipfsRes = await axios.get(
      `https://${firebaseRes.ipfsHash}.ipfs.ipfs-gateway.cloud/metadata.json`
    );
    const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
    setGigDetails({
      ...firebaseRes,
      name: ipfsRes.data.name,
      description: ipfsRes.data.description,
      image: `https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`,
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
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
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
          </Stack>
          <Flex
            flex={1}
            justify={"center"}
            align={"center"}
            position={"relative"}
            w={"full"}
          >
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
          </Flex>
        </Stack>
        <Box rounded={"xl"} boxShadow={"xl"}>
          <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
            <Avatar src={sellerInfo.image} alt={"Author"} />
            <Stack direction={"row"} spacing={0} fontSize={"sm"}>
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
                  size={"lg"}
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
                  size={"lg"}
                  fontWeight={"normal"}
                  px={6}
                >
                  Order Seller
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default GigPage;
