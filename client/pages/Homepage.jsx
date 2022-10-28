import Link from "next/link";
import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconButton,
  createIcon,
  IconProps,
  useColorModeValue,
} from "@chakra-ui/react";
import TutorialModal from "../../components/molecules/TutorialModal";
import Navbar from "../../components/molecules/Navbar";
import HeadingText from "../../components/atoms/HeadingText";

function Homepage() {
  return (
    <>
      <Navbar />
      <Container maxW={"7xl"}>
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <>
              <HeadingText>Deelance,</HeadingText>
              <br />
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
              >
                <Text as={"span"} color={"blue.400"}>
                  a decentralized freelancing platform
                </Text>
              </Heading>
            </>

            <Text color={"gray.500"}>
              Deelance is a platform to get freelance jobs, and get paid in
              crypto tokens, all controlled by a smart contract. Get started
              now!
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <TutorialModal />
              <Link href={"/App"}>
                <Button
                  colorScheme={"blue"}
                  rounded={"full"}
                  size={"lg"}
                  fontWeight={"normal"}
                  px={6}
                >
                  Launch App
                </Button>
              </Link>
            </Stack>
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
              height={"300px"}
              rounded={"2xl"}
              boxShadow={"2xl"}
              width={"full"}
              overflow={"hidden"}
            >
              <Image
                alt={"Hero Image"}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={"100%"}
                src={
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y29tcHV0ZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                }
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
    </>
  );
}

export default Homepage;
