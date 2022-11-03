import Link from "next/link";
import { useContext, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ContractContext } from "../../context/ContractProvider";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import dai from "../../abi/polygonTokens/DaiToken.json";
import usdc from "../../abi/polygonTokens/UsdcToken.json";
import usdt from "../../abi/polygonTokens/UsdtToken.json";
import FundVault from "../atoms/FundVault";
import { useEffect } from "react";
import { ethers } from "ethers";
import { FirebaseContext } from "../../context/FirebaseProvider";
import axios from "axios";

function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { authenticate, isAuthenticated } = useMoralis();
  const { address, contract, getVaultBalance } = useContext(ContractContext);
  const { shortenAddress, isFreelancer } = useContext(UtilitiesContext);
  const { getUserProfile } = useContext(FirebaseContext);

  const [fundInVault, setFundInVault] = useState({
    native: 0,
    stableCoins: { dai: 0, usdc: 0, usdt: 0 },
  });
  const [profileDetails, setProfileDetails] = useState({});

  const getTokensBalance = async (depositorAddress) => {
    const native = await getVaultBalance(depositorAddress, "native");
    const daiBal = await getVaultBalance(depositorAddress, dai.address);
    const usdcBal = await getVaultBalance(depositorAddress, usdc.address);
    const usdtBal = await getVaultBalance(depositorAddress, usdt.address);
    console.log(daiBal, usdcBal.toNumber());
    setFundInVault({
      native: native.toString(),
      stableCoins: {
        dai: daiBal.toNumber(),
        usdc: usdcBal.toNumber(),
        usdt: usdtBal.toNumber(),
      },
    });
  };
  const prepareUserProfile = async () => {
    try {
      const firebaseRes = await getUserProfile(address);
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
  useEffect(() => {
    address && contract && getTokensBalance(address);
  }, [contract, address]);
  useEffect(() => {
    address && prepareUserProfile();
  }, [address]);
  console.log("image", profileDetails.image);
  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        pos={"sticky"}
        top={0}
        zIndex={10}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>Deelance</Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              {isAuthenticated ? (
                <>
                  <Button>{shortenAddress(address)}</Button>
                  <FundVault />
                </>
              ) : (
                <Button
                  onClick={authenticate}
                  variant={"solid"}
                  colorScheme={"blue"}
                  size={"sm"}
                  mr={4}
                >
                  Connect Wallet
                </Button>
              )}
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={
                      profileDetails?.image ||
                      "https://avatars.dicebear.com/api/male/username.svg"
                    }
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={
                        profileDetails?.image ||
                        "https://avatars.dicebear.com/api/male/username.svg"
                      }
                    />
                  </Center>
                  <br />
                  <Center>
                    <Link href={`/${address}/ProfileScreen`}>
                      View/Edit Profile
                    </Link>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>
                    <Link href={`/${address}/GigsAndOrders`}>
                      Your Gigs and Orders
                    </Link>
                  </MenuItem>
                  <MenuDivider />
                  {isFreelancer ? (
                    <MenuItem>
                      <Link href={"/App"}>Client View</Link>
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      <Link href={"/Freelancer"}>Freelancer View</Link>
                    </MenuItem>
                  )}
                  <MenuItem>{`Funds=${ethers.utils.formatEther(
                    fundInVault.native
                  )}Eth, $${
                    fundInVault.stableCoins.dai +
                    fundInVault.stableCoins.usdc +
                    fundInVault.stableCoins.usdt
                  }`}</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuDivider />
                  <MenuItem>Logout</MenuItem>
                  {address == "0x741dfbfa5843311fed71f65967cf2e766b9c33bd" && (
                    <MenuItem>
                      <Link href={"/Admin"}>Admin Panel</Link>
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
export default Navbar;
