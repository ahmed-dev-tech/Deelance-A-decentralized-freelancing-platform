import Link from "next/link";
import { ReactNode, useContext } from "react";
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

function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authenticate, isAuthenticated, isWeb3Enabled } = useMoralis();
  const { address } = useContext(ContractContext);
  const { shortenAddress, isFreelancer } = useContext(UtilitiesContext);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>Deelance</Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              {isAuthenticated ? (
                <Button>{shortenAddress(address)}</Button>
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
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {isFreelancer ? (
                    <MenuItem>
                      <Link href={"/screens/App"}>Be a Client</Link>
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      <Link href={"/screens/Freelancer"}>Be a Freelancer</Link>
                    </MenuItem>
                  )}
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem>
                  {address == 0x741dfbfa5843311fed71f65967cf2e766b9c33bd && (
                    <MenuItem>
                      <Link href={"/screens/Admin"}>Admin Panel</Link>
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
