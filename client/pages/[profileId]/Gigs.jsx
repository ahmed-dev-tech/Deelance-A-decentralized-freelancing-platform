import { Box, Heading } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/molecules/Navbar";
import { ContractContext } from "../../context/ContractProvider";
import { FirebaseContext } from "../../context/FirebaseProvider";
import UserGigSidebar from "../../components/molecules/UserGigSidebar";
import GigGrid from "../../components/molecules/GigGrid";

function Gigs(props) {
  const { getGigs, getMoreGigs, getOrders, getMoreOrders } =
    useContext(FirebaseContext);
  const { address } = useContext(ContractContext);

  let gigLimit = 7;

  const [displayData, setDisplayData] = useState({
    ownedGigs: { data: [], lastVisible: null, hasMore: true },
    interestedGigs: { data: [], lastVisible: null, hasMore: true },
    ownedOrders: { data: [], lastVisible: null, hasMore: true },
    interestedOrders: { data: [], lastVisible: null, hasMore: true },
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
  useEffect(() => {
    // Get owned gigs
    getGigs("rating", gigLimit, ["address", "==", address]).then((res) => {
      setDisplayData({
        ...displayData,
        ownedGigs: {
          data: [...displayData.ownedGigs.data, ...res?.data],
          lastVisible: res?.lastVisible,
          hasMore: res?.data.length < gigLimit ? false : true,
        },
      });
    });
    //Get interested gigs
    getGigs("rating", gigLimit, [
      "biddersArray",
      "array-contains",
      address,
    ]).then((res) => {
      setDisplayData({
        ...displayData,
        ownedGigs: {
          data: [...displayData.ownedGigs.data, ...res?.data],
          lastVisible: res?.lastVisible,
          hasMore: res?.data.length < gigLimit ? false : true,
        },
      });
    });
    // Get owned orders
    getOrders("timestamp", gigLimit, ["address", "==", address]).then((res) => {
      setDisplayData({
        ...displayData,
        ownedOrders: {
          data: [...displayData.ownedOrders.data, ...res?.data],
          lastVisible: res?.lastVisible,
          hasMore: res?.data.length < gigLimit ? false : true,
        },
      });
    });
    //Get interested orders
    getOrders("timestamp", gigLimit, [
      "biddersArray",
      "array-contains",
      address,
    ]).then((res) => {
      setDisplayData({
        ...displayData,
        interestedOrders: {
          data: [...displayData.interestedOrders.data, ...res?.data],
          lastVisible: res?.lastVisible,
          hasMore: res?.data.length < gigLimit ? false : true,
        },
      });
    });
    // will get back to this once done with posting gigs as a freelancer
  }, [address]);

  return (
    <>
      <Navbar />
      <UserGigSidebar>
        <>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Your owned gigs
          </Heading>
          <Box>
            <GigGrid
              displayData={displayData.ownedGigs}
              fetchMoreData={fetchMoreData}
              params={"ownedGigs"}
            />
          </Box>
        </>
        <>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Gigs you are interested in
          </Heading>
          <Box>
            <GigGrid
              displayData={displayData.interestedGigs}
              fetchMoreData={fetchMoreData}
              params={"interestedGigs"}
            />
          </Box>
        </>
        <>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Your Orders
          </Heading>
          <Box>
            <GigGrid
              displayData={displayData.ownedOrders}
              fetchMoreData={fetchMoreData}
              params={"ownedOrders"}
            />
          </Box>
        </>
        <>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Orders you are interested in
          </Heading>
          <Box>
            <GigGrid
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
