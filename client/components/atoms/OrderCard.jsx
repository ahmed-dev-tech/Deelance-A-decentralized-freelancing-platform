import {
  Flex,
  Box,
  Image,
  useColorModeValue,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import Rating from "./Rating";

function OrderCard({ content }) {
  const { shortenAddress, shortenText } = useContext(UtilitiesContext);

  const [orderName, setOrderName] = useState("");
  const [orderImage, setOrderImage] = useState("");
  const fetchMetaData = async () => {
    let res = await axios.get(
      `https://${content.ipfsHash}.ipfs.ipfs-gateway.cloud/metadata.json`
    );
    setOrderName(res.data.name);
    const [cid, fileName] = res.data.image.slice(7).split("/");
    console.log(cid, fileName);
    setOrderImage(`https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`);
  };
  useEffect(() => {
    fetchMetaData();
  }, []);
  return (
    <Box
      maxW="sm"
      minW="xs"
      h="xs"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Image
        height={"150px"}
        width={"100%"}
        src={orderImage}
        alt={"ipfs image"}
        layout={"fill"}
      />

      <Box p="6">
        <Box mt="1" as="h4" lineHeight="tight">
          {shortenText(orderName, 40)}
        </Box>

        <Flex justifyContent="space-between" alignContent="center">
          <Rating
            rating={content.rating}
            numReviews={content.biddersArray.length}
          />
          <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
            <Box as="span" color={"gray.600"} fontSize="lg">
              $
            </Box>
            {"price"}
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignContent="center">
          <Tooltip
            label="Seller's Address"
            bg="white"
            placement={"top"}
            color={"gray.800"}
            fontSize={"1.2em"}
          >
            <Button>{shortenAddress(content.address)}</Button>
          </Tooltip>
          <Box
            fontSize="xs"
            color={useColorModeValue("gray.800", "white")}
            pt={5}
          >
            {new Date(content.timestamp).toDateString()}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default OrderCard;
