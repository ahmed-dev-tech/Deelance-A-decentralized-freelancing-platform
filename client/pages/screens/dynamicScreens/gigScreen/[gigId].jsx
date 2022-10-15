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
} from "@chakra-ui/react";
import Navbar from "../../../../components/molecules/Navbar";
import { FirebaseContext } from "../../../../context/FirebaseProvider";
import axios from "axios";

function GigPage(req, res) {
  const router = useRouter();
  const { gigId } = router.query;

  const { fetchGigDetails } = useContext(FirebaseContext);

  const [gigDetails, setGigDetails] = useState({});

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
    prepareGigDetails();
  }, []);
  console.log(gigDetails);
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
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
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
      </Container>
    </>
  );
}

export default GigPage;
