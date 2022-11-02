import { Stack, Box, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/FirebaseProvider";
import OrderCard from "../atoms/OrderCard";
import OrderGrid from "./OrderGrid";

const SellerTabContent = (props) => {
  const { getOrders } = useContext(FirebaseContext);
  const [orders, setOrders] = useState({
    data: [],
    lastVisible: null,
    hasMore: false,
  });
  let orderLimit = 5;

  const fetchMoreOrders = async (dataCategory) => {
    let more = await getMoreOrders(orders.lastVisible, "timestamp", orderLimit);
    setOrders({
      data: [...orders.data, ...more.data],
      lastVisible: more.lastVisible,
      hasMore: more.data.length < orderLimit ? false : true,
    });
  };
  useEffect(() => {
    getOrders("timestamp", orderLimit, ["category", "==", props.category]).then(
      (res) => {
        setOrders({
          data: res.data,
          lastVisible: res.lastVisible,
          hasMore: res.data.length < orderLimit ? false : true,
        });
      }
    );
    // will get back to this once done with posting gigs as a freelancer
  }, [props]);
  return (
    <Box p={5}>
      <Box py={5}>
        {props?.category?.subCategories?.map((subCat, i) => {
          return (
            <>
              <Heading fontSize="2xl">{subCat}</Heading>
              <Box py={5}>
                <OrderGrid
                  displayData={orders}
                  fetchMoreData={fetchMoreOrders}
                  params={""}
                  wrap={true}
                  filter={true}
                  subCat={subCat}
                />
              </Box>
            </>
          );
        })}
      </Box>
    </Box>
  );
};

export default SellerTabContent;
