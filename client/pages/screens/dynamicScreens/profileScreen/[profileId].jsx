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
  const { contract, registerFreelancer } = useContext(ContractContext);

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
    profileId &&
      prepareUserProfile() &&
      getGigs("rating", 5, ["address", "==", profileId]).then((res) => {
        setGigs(res);
      });
  }, [profileId]);
  console.log(profileDetails);
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
          Edit Profile
        </Text>
      </Heading>
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
          Client Info
        </Text>
      </Heading>

      <Box p={"5"} mx={"auto"}>
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
            Gigs
          </Text>
        </Heading>
        <HStack overflowX={"scroll"} spacing={4}>
          {gigs.map((_, i) => {
            return <GigCard content={_} key={i} />;
          })}
        </HStack>
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
        <Button
          onClick={() => {
            contract && registerFreelancer();
          }}
        >
          Be a Deelancer
        </Button>
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
            Orders
          </Text>
        </Heading>
        <HStack overflowX={"scroll"} spacing={4}>
          {gigs.map((_, i) => {
            return <GigCard content={_} key={i} />;
          })}
        </HStack>
      </Box>
    </Box>
  );
}

export default ProfilePage;
