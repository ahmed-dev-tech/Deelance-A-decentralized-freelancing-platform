import Link from "next/link";
import {
  Flex,
  Box,
  Image,
  useColorModeValue,
  Tooltip,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import Rating from "./Rating";
import { FiExternalLink } from "react-icons/fi";

function GigCard({ content }) {
  const { shortenAddress, shortenText } = useContext(UtilitiesContext);

  const [gigName, setGigName] = useState("");
  const [gigImage, setGigImage] = useState("");
  const fetchMetaData = async () => {
    let res = await axios.get(
      `https://${content.ipfsHash}.ipfs.nftstorage.link/metadata.json`
    );
    setGigName(res.data.name);
    const [cid, fileName] = res.data.image.slice(7).split("/");
    console.log(cid, fileName);
    setGigImage(`https://${cid}.ipfs.nftstorage.link/${fileName}`);
  };
  useEffect(() => {
    fetchMetaData();
  }, []);
  return (
    <Box
      maxW="xs"
      maxH="xs"
      minH="3xs"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      position={"relative"}
    >
      <Link href={`/gigScreen/${content.id}`}>
        <IconButton
          aria-label={"Play Button"}
          variant={"ghost"}
          _hover={{ bg: "transparent" }}
          icon={
            <Icon as={FiExternalLink} style={{ color: "gray" }} w={7} h={7} />
          }
          size={"lg"}
          color={"gray"}
          position={"absolute"}
          right={"-6"}
          top={"4"}
          transform={"translateX(-50%) translateY(-50%)"}
        />
      </Link>
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
            numReviews={content?.orderArray?.length}
          />
          <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
            <Box as="span" color={"gray.600"} fontSize="lg">
              ${/* content.price.token */}
            </Box>
            {content?.price?.value}
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

export default GigCard;
