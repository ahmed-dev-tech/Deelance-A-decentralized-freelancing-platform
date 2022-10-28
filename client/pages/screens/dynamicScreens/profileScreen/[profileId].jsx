import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FirebaseContext } from "../../../../context/FirebaseProvider";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "../../../../components/molecules/Navbar";
import Rating from "../../../../components/atoms/Rating";
import GigCard from "../../../../components/atoms/GigCard";
import { ContractContext } from "../../../../context/ContractProvider";
import EditProfile from "../../../../components/molecules/EditProfile";

function ProfilePage(props) {
  const router = useRouter();
  const { profileId } = router.query;

  const { getUserProfile, getGigs } = useContext(FirebaseContext);
  const {
    address,
    contract,
    registerFreelancer,
    registerClient,
    userDetailsOnChain,
  } = useContext(ContractContext);

  const [profileDetails, setProfileDetails] = useState({});
  const [gigs, setGigs] = useState([]);

  const prepareUserProfile = async () => {
    try {
      const firebaseRes = await getUserProfile(profileId);
      if (!firebaseRes.ipfsHash) setProfileDetails({});
      let ipfsRes = await axios.get(
        `https://${firebaseRes.ipfsHash}.ipfs.nftstorage.link/metadata.json`
      );
      const [cid, fileName] = ipfsRes.data.image.slice(7).split("/");
      setProfileDetails({
        ...firebaseRes,
        name: ipfsRes.data.name,
        bio: ipfsRes.data.description,
        image: `https://${cid}.ipfs.nftstorage.link/${fileName}`,
      });
      console.log(`https://${cid}.ipfs.nftstorage.link/${fileName}`);
    } catch (error) {
      setProfileDetails({});
    }
  };
  const data = {
    address,
    profileId,
    profileDetails,
  };
  useEffect(() => {
    if (profileId) {
      prepareUserProfile();
      getGigs("rating", 5, ["address", "==", profileId]).then((res) => {
        setGigs(res);
      });
    }
  }, [profileId, contract]);

  return (
    <Box>
      <Navbar />
      <Box>
        {address == profileId ? (
          <Box display={{ md: "flex" }}>
            <EditProfile props={data} />
            <Flex w={{ base: "100%", md: "50%" }}>
              <Stack
                spacing={4}
                w={"full"}
                maxW={"md"}
                rounded={"xl"}
                boxShadow={"lg"}
                p={6}
                my={12}
              >
                <Box>
                  <Text>Be a Client on Chain</Text>
                  {userDetailsOnChain.isClient ? (
                    <Text>You are a client already</Text>
                  ) : (
                    <Button
                      onClick={() => {
                        contract && registerClient();
                      }}
                    >
                      Be a Client
                    </Button>
                  )}
                </Box>
                <Box>
                  <Text>Be a Deelancer on Chain</Text>
                  {userDetailsOnChain.isFreelancer ? (
                    <Text>You are a freelancer already</Text>
                  ) : (
                    <Button
                      onClick={() => {
                        contract && registerFreelancer();
                      }}
                    >
                      Be a Deelancer
                    </Button>
                  )}
                </Box>
                <Box p={"5"} mx={"auto"}>
                  <Heading
                    lineHeight={1.1}
                    fontSize={{ base: "2xl", sm: "3xl" }}
                  >
                    Buyer Rating
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
                    fontSize={{ base: "2xl", sm: "3xl" }}
                  >
                    Seller Rating
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
              </Stack>
            </Flex>
          </Box>
        ) : (
          <Box display={{ md: "flex" }}>
            <Flex
              w={{ base: "100%", md: "50%" }}
              align={"left"}
              justify={"left"}
            >
              <Stack
                spacing={4}
                w={"full"}
                maxW={"md"}
                rounded={"xl"}
                boxShadow={"lg"}
                p={6}
                my={12}
              >
                <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                  User Profile
                </Heading>

                <Stack direction={["column", "row"]} spacing={6}>
                  <Center>
                    <Avatar
                      size="5xl"
                      src={profileDetails.image || ""}
                    ></Avatar>
                  </Center>
                </Stack>
                <>
                  <Heading
                    lineHeight={1.0}
                    fontSize={{ base: "xl", sm: "2xl" }}
                  >
                    {profileDetails.name || "No name"}
                  </Heading>
                  <Text>{profileDetails.bio || "No bio updated"}</Text>
                </>
              </Stack>
            </Flex>
            <Flex w={{ base: "100%", md: "50%" }}>
              <Stack
                spacing={4}
                w={"full"}
                maxW={"md"}
                rounded={"xl"}
                boxShadow={"lg"}
                p={6}
                my={12}
              >
                <Flex
                  p={"5"}
                  direction={"column"}
                  justifyContent={"space-between"}
                >
                  <Box p={5}>
                    <Heading
                      lineHeight={1.1}
                      fontSize={{ base: "2xl", sm: "3xl" }}
                    >
                      Buyer Rating
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
                  <Box p={5}>
                    <Heading
                      lineHeight={1.1}
                      fontSize={{ base: "2xl", sm: "3xl" }}
                    >
                      Seller Rating
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
                </Flex>
              </Stack>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ProfilePage;
