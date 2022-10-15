import { Stack, HStack, VStack, Box, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/FirebaseProvider";
import GigCard from "../atoms/GigCard";

const ClientTabContent = (props) => {
  const { getGigs } = useContext(FirebaseContext);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    getGigs("rating", 10, ["category", "==", props.category]).then((res) => {
      setGigs(res);
    });
    // will get back to this once done with posting gigs as a freelancer
  }, []);
  return (
    <Box p={5}>
      <Heading fontSize="2xl">Tech</Heading>
      <Box py={5}>
        <HStack
          style={{ scrollbarWidth: "none" }}
          spacing={8}
          overflowX="scroll"
        >
          {gigs.map((_, i) => {
            return <GigCard content={_} key={i} />;
          })}
        </HStack>
      </Box>
    </Box>
  );
};

export default ClientTabContent;
