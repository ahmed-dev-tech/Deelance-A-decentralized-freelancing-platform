import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FirebaseContext } from "../../../../context/FirebaseProvider";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { NFTStorageContext } from "../../../../context/NFTStorageProvider";
import Navbar from "../../../../components/molecules/Navbar";
import ImagePicker from "../../../../components/atoms/imagePicker";
import Rating from "../../../../components/atoms/Rating";

function ProfilePage(props) {
  const router = useRouter();
  const { profileId } = router.query;

  const { editProfile, getUserProfile } = useContext(FirebaseContext);
  const { deployToNFTStorage } = useContext(NFTStorageContext);

  const [profileDetails, setProfileDetails] = useState({});
  const [name, setName] = useState(profileDetails.name || "");
  const [bio, setBio] = useState(profileDetails.bio || "");
  const [pic, setPic] = useState({});
  const [isAltered, setIsAltered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    profileId && prepareUserProfile();
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

      <Box width={"lg"} p={"5"} mx={"auto"}>
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
      <Box width={"lg"} p={"5"} mx={"auto"}>
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
    </Box>
  );
}

export default ProfilePage;
