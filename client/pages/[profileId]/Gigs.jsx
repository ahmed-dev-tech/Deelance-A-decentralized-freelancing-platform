import { Box, Heading } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/molecules/Navbar";
import { ContractContext } from "../../context/ContractProvider";
import { FirebaseContext } from "../../context/FirebaseProvider";
import UserGigSidebar from "../../components/molecules/UserGigSidebar";
import GigGrid from "../../components/molecules/GigGrid";
import OrderGrid from "../../components/molecules/OrderGrid";

function Gigs(props) {
  const { getGigs, getMoreGigs, getOrders, getMoreOrders } =
    useContext(FirebaseContext);
  const { address } = useContext(ContractContext);

  let gigLimit = 7;

  const [displayData, setDisplayData] = useState({
    ownedGigs: { data: [], lastVisible: null, hasMore: false },
    interestedGigs: { data: [], lastVisible: null, hasMore: false },
    ownedOrders: { data: [], lastVisible: null, hasMore: false },
    interestedOrders: { data: [], lastVisible: null, hasMore: false },
  });

  const fetchMoreData = async (dataCategory) => {
    let more;
    switch (dataCategory) {
      case "ownedGigs":
        more = await getMoreGigs(
          displayData[dataCategory].lastVisible,
          "rating",
          gigLimit,
          ["address", "==", address]
        );
        break;
      case "interestedGigs":
        more = await getMoreGigs(
          displayData[dataCategory].lastVisible,
          "rating",
          gigLimit,
          ["biddersArray", "array-contains", address]
        );
        break;
      case "ownedOrders":
        more = await getMoreOrders(
          displayData[dataCategory].lastVisible,
          "timestamp",
          gigLimit,
          ["address", "==", address]
        );
        break;
      case "interestedOrders":
        more = await getMoreOrders(
          displayData[dataCategory].lastVisible,
          "timestamp",
          gigLimit,
          ["biddersArray", "array-contains", address]
        );
        break;
      default:
        break;
    }
    setDisplayData({
      ...displayData,
      [dataCategory]: {
        data: [...displayData[dataCategory].data, ...more.data],
        lastVisible: more.lastVisible,
        hasMore: more.data.length < gigLimit ? false : true,
      },
    });
  };
  const fetchInitialData = async () => {
    let res1, res2, res3, res4;
    try {
      res1 = await getGigs("rating", gigLimit, ["address", "==", address]);
      res2 = await getGigs("rating", gigLimit, [
        "biddersArray",
        "array-contains",
        address,
      ]);
      res3 = await getOrders("timestamp", gigLimit, ["address", "==", address]);
      res4 = await getOrders("timestamp", gigLimit, [
        "biddersArray",
        "array-contains",
        address,
      ]);
    } catch (error) {
      throw error;
    }
    setDisplayData({
      ownedGigs: {
        data: res1.data,
        lastVisible: res1.lastVisible,
        hasMore: res1.data.length < gigLimit ? false : true,
      },
      interestedGigs: {
        data: res2.data,
        lastVisible: res2.lastVisible,
        hasMore: res2.data.length < gigLimit ? false : true,
      },
      ownedOrders: {
        data: res3.data,
        lastVisible: res3.lastVisible,
        hasMore: res3.data.length < gigLimit ? false : true,
      },
      interestedOrders: {
        data: res4.data,
        lastVisible: res4.lastVisible,
        hasMore: res4.data.length < gigLimit ? false : true,
      },
    });
  };
  useEffect(() => {
    // Get owned gigs
    address && fetchInitialData();
    // will get back to this once done with posting gigs as a freelancer
  }, [address]);
  console.log(10, displayData);
  return (
    <>
      <Navbar />
      <UserGigSidebar>
        <>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl" }}
            id="ownedGigs"
            p={4}
          >
            Your owned gigs
          </Heading>
          <Box shadow={"sm"} borderRadius={"2xl"}>
            <GigGrid
              displayData={displayData.ownedGigs}
              fetchMoreData={fetchMoreData}
              params={"ownedGigs"}
            />
          </Box>
        </>
        <>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl" }}
            id="interestedGigs"
            p={4}
          >
            Gigs you are interested in
          </Heading>
          <Box shadow={"sm"} borderRadius={"2xl"}>
            <GigGrid
              displayData={displayData.interestedGigs}
              fetchMoreData={fetchMoreData}
              params={"interestedGigs"}
            />
          </Box>
        </>
        <>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl" }}
            id="ownedOrders"
            p={4}
          >
            Your Orders
          </Heading>
          <Box shadow={"sm"} borderRadius={"2xl"}>
            <OrderGrid
              displayData={displayData.ownedOrders}
              fetchMoreData={fetchMoreData}
              params={"ownedOrders"}
            />
          </Box>
        </>
        <>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl" }}
            id="interestedOrders"
            p={4}
          >
            Orders you are interested in
          </Heading>
          <Box shadow={"sm"} borderRadius={"2xl"}>
            <OrderGrid
              displayData={displayData.interestedOrders}
              fetchMoreData={fetchMoreData}
              params={"interestedOrders"}
            />
          </Box>
        </>
      </UserGigSidebar>
    </>
  );
}

export default Gigs;
