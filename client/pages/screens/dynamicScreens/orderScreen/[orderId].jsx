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

function OrderPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const { fetchOrderDetails, getUserProfile, updateOrder, deleteOrder } =
    useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);
  const { shortenText } = useContext(UtilitiesContext);
  const { address } = useContext(ContractContext);

  const [orderDetails, setOrderDetails] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [orderName, setOrderName] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [orderPic, setOrderPic] = useState({});
  const [price, setPrice] = useState(0);
  const [isAltered, setIsAltered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputFile = useRef(null);

  const fetchFile = (e) => {
    e.preventDefault();
    setOrderPic(e.target.files[0]);
    setIsAltered(true);
  };
  const saveOrder = async () => {
    try {
      setIsSaving(true);
      const res = await deployToNFTStorage(
        orderName || orderDetails.name,
        orderDescription || orderDetails.description,
        orderPic
      );
      await updateOrder(orderId, { ipfsHash: res.ipnft });
    } catch (error) {
      throw error;
    }
    setIsSaving(false);
    setIsAltered(false);
  };
  const removeOrder = async () => {
    setIsDeleting(true);
    await deleteOrder(orderId);
    setIsDeleting(false);
  };
  const fetchClientInfo = async (address) => {
    const res = await getUserProfile(address);
    let ipfsRes = await axios.get(
      `https://${res.ipfsHash}.ipfs.ipfs-gateway.cloud/metadata.json`
    );
    const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
    setClientInfo({
      name: ipfsRes.data.name,
      bio: ipfsRes.data.description,
      image: `https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`,
    });
  };
  const prepareOrderDetails = async () => {
    const firebaseRes = await fetchOrderDetails(orderId);
    let ipfsRes = await axios.get(
      `https://${firebaseRes.ipfsHash}.ipfs.ipfs-gateway.cloud/metadata.json`
    );
    const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
    setOrderDetails({
      ...firebaseRes,
      name: ipfsRes.data.name,
      description: ipfsRes.data.description,
      image: `https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`,
    });
  };
  useEffect(() => {
    orderId && prepareOrderDetails();
  }, [orderId]);
  useEffect(() => {
    orderDetails.address && fetchClientInfo(orderDetails.address);
  }, [orderDetails.address]);
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
            {orderDetails.address == address ? (
              <>
                <FormControl>
                  <Input
                    value={orderName}
                    onChange={(e) => {
                      setIsAltered(true);
                      setOrderName(e.target.value);
                    }}
                    placeholder={orderDetails.name}
                  />
                </FormControl>
                <FormControl>
                  <Textarea
                    value={orderDescription}
                    onChange={(e) => {
                      setIsAltered(true);
                      setOrderDescription(e.target.value);
                    }}
                    placeholder={orderDetails.description}
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
                    {orderDetails.name}
                  </Text>
                </Heading>
                <Text color={"gray.500"}>{orderDetails.description}</Text>
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
            {orderDetails.address == address ? (
              <Box width={"lg"}>
                <FormControl isRequired>
                  <Input
                    onChange={(e) => fetchFile(e)}
                    ref={inputFile}
                    type={"file"}
                    style={{ display: "none" }}
                  />
                </FormControl>
                <ImagePicker inputFile={inputFile} image={orderDetails.image} />
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
                  src={orderDetails.image}
                />
              </Box>
            )}
          </Flex>
        </Stack>
        {orderDetails.address == address ? (
          <HStack pos="fixed" bottom="10" right="10">
            <Button
              isDisabled={!isAltered}
              isLoading={isSaving}
              onClick={saveOrder}
            >
              Save
            </Button>
            <Button isLoading={isDeleting} onClick={removeOrder}>
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
              <Avatar src={clientInfo.image} alt={"Author"} />
              <Stack direction={"row"} spacing={3} fontSize={"sm"}>
                <Stack direction={"column"} spacing={0} fontSize={"sm"}>
                  <Text fontWeight={600}>{clientInfo.name}</Text>
                  <Text color={"gray.500"}>
                    {clientInfo.bio && shortenText(clientInfo.bio, 25)}
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
                    Contact Client
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
                    Show Interest
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

export default OrderPage;
