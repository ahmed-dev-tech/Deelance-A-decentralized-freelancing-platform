import Link from "next/link";
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

function GigCard({ content }) {
  const { shortenAddress, shortenText } = useContext(UtilitiesContext);

  const [gigName, setGigName] = useState("");
  const [gigImage, setGigImage] = useState("");
  const fetchMetaData = async () => {
    let res = await axios.get(
      `https://${content.ipfsHash}.ipfs.ipfs-gateway.cloud/metadata.json`
    );
    setGigName(res.data.name);
    const [cid, fileName] = res.data.image.slice(7).split("/");
    console.log(cid, fileName);
    setGigImage(`https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`);
  };
  useEffect(() => {
    fetchMetaData();
  }, []);
  return (
    <Link href={`/screens/dynamicScreens/gigScreen/${content.id}`}>
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
          src={gigImage}
          alt={"ipfs image"}
          layout={"fill"}
        />

        <Box p="6">
          <Box mt="1" as="h4" lineHeight="tight">
            {shortenText(gigName, 40)}
          </Box>

          <Flex justifyContent="space-between" alignContent="center">
            <Rating
              rating={content.rating}
              numReviews={content.orderArray.length}
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
    </Link>
  );
}

export default GigCard;
