import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FirebaseContext } from "../../../../context/FirebaseProvider";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { NFTStorageContext } from "../../../../context/NFTStorageProvider";
import Navbar from "../../../../components/molecules/Navbar";
import ImagePicker from "../../../../components/atoms/imagePicker";
import Rating from "../../../../components/atoms/Rating";
import GigCard from "../../../../components/atoms/GigCard";
import { ContractContext } from "../../../../context/ContractProvider";

function ProfilePage(props) {
  const router = useRouter();
  const { profileId } = router.query;

  const { editProfile, getUserProfile, getGigs } = useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);
  const {
    address,
    contract,
    registerFreelancer,
    registerClient,
    userDetailsOnChain,
  } = useContext(ContractContext);

  const [profileDetails, setProfileDetails] = useState({});
  const [name, setName] = useState(profileDetails.name || "");
  const [bio, setBio] = useState(profileDetails.bio || "");
  const [pic, setPic] = useState({});
  const [isAltered, setIsAltered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [gigs, setGigs] = useState([]);
  const inputFile = useRef(null);

  const fetchFile = (e) => {
    e.preventDefault();
    setPic(e.target.files[0]);
    setIsAltered(true);
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
    setIsAltered(false);
  };
  const prepareUserProfile = async () => {
    try {
      const firebaseRes = await getUserProfile(profileId);
      if (!firebaseRes.ipfsHash) setProfileDetails({});
      let ipfsRes = await axios.get(
        `https://${firebaseRes.ipfsHash}.ipfs.ipfs-gateway.cloud/metadata.json`
      );
      const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
      setProfileDetails({
        ...firebaseRes,
        name: ipfsRes.data.name,
        bio: ipfsRes.data.description,
        image: `https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`,
      });
      console.log(`https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`);
    } catch (error) {
      setProfileDetails({});
    }
  };
  useEffect(() => {
    if (profileId) {
      prepareUserProfile();
      getGigs("rating", 5, ["address", "==", profileId]).then((res) => {
        setGigs(res);
      });
    }
  }, [profileId, contract]);
  console.log(userDetailsOnChain);
  return (
    <Box>
      <Navbar />
      <Heading
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
      >
        <Text
          as={"span"}
          position={"relative"}
          _after={{
            content: "''",
            width: "full",
            height: "30%",
            position: "absolute",
            bottom: 1,
            left: 0,
            bg: "blue.400",
            zIndex: -1,
          }}
        >
          {address == profileId ? "Edit Profile" : "Profile"}
        </Text>
      </Heading>
      {address == profileId ? (
        <Box width={"lg"} p={"5"} mx={"auto"}>
          <ImagePicker image={profileDetails.image} inputFile={inputFile} />
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => {
                setIsAltered(true);
                setName(e.target.value);
              }}
              placeholder={profileDetails.name}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Bio</FormLabel>
            <Textarea
              value={bio}
              onChange={(e) => {
                setIsAltered(true);
                setBio(e.target.value);
              }}
              placeholder={profileDetails.bio}
            />
          </FormControl>
          <FormControl isRequired>
            <Input
              onChange={(e) => fetchFile(e)}
              ref={inputFile}
              type={"file"}
              style={{ display: "none" }}
            />
          </FormControl>
        </Box>
      ) : (
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
                {profileDetails.name || "Anonymous"}
              </Text>
            </Heading>
            <Text color={"gray.500"}>
              {profileDetails.bio || "no bio updated"}
            </Text>
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
              height={"xs"}
              rounded={"full"}
              boxShadow={"2xl"}
              width={"xs"}
              overflow={"hidden"}
            >
              <Image
                alt={"Hero Image"}
                fit={"contain"}
                align={"center"}
                w={"100%"}
                h={"100%"}
                src={
                  profileDetails.image ||
                  "https://www.istockphoto.com/photo/abstract-pastel-gray-color-and-gradient-white-light-background-in-studio-table-gm1337024740-418057649?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fempty&utm_term=empty%3A%3A%3A"
                }
              />
            </Box>
          </Flex>
        </Stack>
      )}

      {address == profileId && (
        <Button
          colorScheme="blue"
          mr={3}
          pos="fixed"
          bottom="10"
          right="10"
          onClick={(e) => saveProfile(e)}
          isLoading={isSaving}
          isDisabled={!isAltered}
        >
          Save
        </Button>
      )}

      <Heading
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
      >
        <Text
          as={"span"}
          position={"relative"}
          _after={{
            content: "''",
            width: "full",
            height: "30%",
            position: "absolute",
            bottom: 1,
            left: 0,
            bg: "blue.400",
            zIndex: -1,
          }}
        >
          Client Info
        </Text>
      </Heading>

      <Box p={"5"} mx={"auto"}>
        {address == profileId && !userDetailsOnChain.isClient && (
          <Button
            onClick={() => {
              contract && registerClient();
            }}
          >
            Be a Client
          </Button>
        )}
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text as={"span"} color={"blue.400"}>
            Rating
          </Text>
        </Heading>
        <Rating
          rating={profileDetails.clientRating || 0}
          numReviews={
            profileDetails.clientReviewers
              ? profileDetails.clientReviewers.length
              : 0
          }
        />
      </Box>
      <Box p={"5"} mx={"auto"}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text as={"span"} color={"blue.400"}>
            Orders
          </Text>
        </Heading>
        {gigs.length ? (
          <HStack overflowX={"scroll"} spacing={4}>
            {gigs.map((_, i) => {
              return <GigCard content={_} key={i} />;
            })}
          </HStack>
        ) : (
          "You have no Orders"
        )}
      </Box>
      <Heading
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
      >
        <Text
          as={"span"}
          position={"relative"}
          _after={{
            content: "''",
            width: "full",
            height: "30%",
            position: "absolute",
            bottom: 1,
            left: 0,
            bg: "blue.400",
            zIndex: -1,
          }}
        >
          Seller Info
        </Text>
      </Heading>
      <Box p={"5"} mx={"auto"}>
        {address == profileId && !userDetailsOnChain.isFreelancer && (
          <Button
            onClick={() => {
              contract && registerFreelancer();
            }}
          >
            Be a Deelancer
          </Button>
        )}

        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text as={"span"} color={"blue.400"}>
            Rating
          </Text>
        </Heading>
        <Rating
          rating={profileDetails.sellerRating || 0}
          numReviews={
            profileDetails.sellerReviewers
              ? profileDetails.sellerReviewers.length
              : 0
          }
        />
      </Box>
      <Box p={"5"} mx={"auto"}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text as={"span"} color={"blue.400"}>
            Gigs
          </Text>
        </Heading>
        {gigs.length ? (
          <HStack overflowX={"scroll"} spacing={4}>
            {gigs.map((_, i) => {
              return <GigCard content={_} key={i} />;
            })}
          </HStack>
        ) : (
          "You have no gigs"
        )}
      </Box>
    </Box>
  );
}

export default ProfilePage;
