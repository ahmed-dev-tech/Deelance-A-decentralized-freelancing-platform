import { Stack, HStack, VStack, Box, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/FirebaseProvider";
import GigCard from "../atoms/GigCard";
import OrderCard from "../atoms/OrderCard";

const SellerTabContent = (props) => {
  const { getOrders } = useContext(FirebaseContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders("timestamp", 10, ["category", "==", props.category]).then(
      (res) => {
        setOrders(res);
      }
    );
    // will get back to this once done with posting gigs as a freelancer
  }, []);
  return (
    <Box p={5}>
      <Heading fontSize="2xl">Sub category</Heading>
      <Box py={5}>
        <HStack
          style={{ scrollbarWidth: "none" }}
          spacing={8}
          overflowX="scroll"
        >
          {orders.map((_, i) => {
            return <OrderCard content={_} key={i} />;
          })}
        </HStack>
      </Box>
    </Box>
  );
};

export default SellerTabContent;