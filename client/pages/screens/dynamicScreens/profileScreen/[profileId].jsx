import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FirebaseContext } from "../../../../context/FirebaseProvider";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { NFTStorageContext } from "../../../../context/NFTStorageProvider";
import ImagePicker from "../../../../components/atoms/imagePicker";

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
  return (
    <Box>
      <Box width={"sm"}>
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
          <FormLabel>Select an Image</FormLabel>
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
    </Box>
  );
}

export default ProfilePage;
