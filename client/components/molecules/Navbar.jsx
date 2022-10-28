import Link from "next/link";
import { ReactNode, useContext, useState } from "react";
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

function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authenticate, isAuthenticated, isWeb3Enabled } = useMoralis();
  const { address, contract, getVaultBalance } = useContext(ContractContext);
  const { shortenAddress, isFreelancer } = useContext(UtilitiesContext);

  const [fundInVault, setFundInVault] = useState({
    native: 0,
    stableCoins: { dai: 0, usdc: 0, usdt: 0 },
  });
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
  useEffect(() => {
    address && contract && getTokensBalance(address);
  }, [contract, address]);
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
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
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <Link href={`/profileScreen/${address}`}>
                      View/Edit Profile
                    </Link>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Gigs</MenuItem>
                  <MenuItem>Your Orders</MenuItem>
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
