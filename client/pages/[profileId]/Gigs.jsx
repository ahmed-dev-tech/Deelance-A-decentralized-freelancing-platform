import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import GigCard from "../../components/atoms/GigCard";
import Navbar from "../../components/molecules/Navbar";
import { ContractContext } from "../../context/ContractProvider";
import { FirebaseContext } from "../../context/FirebaseProvider";
import InfiniteScroll from "react-infinite-scroller";
import UserGigSidebar from "../../components/molecules/UserGigSidebar";

function Gigs(props) {
  const { getGigs, getMoreGigs } = useContext(FirebaseContext);
  const { address } = useContext(ContractContext);

  let gigLimit = 5;

  const [gigs, setGigs] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreGigs = async () => {
    const more = await getMoreGigs(gigs[gigs.length - 1], "rating", gigLimit, [
      "address",
      "==",
      address,
    ]);
    setGigs([...gigs, ...more]);
    if (more.length < gigLimit) setHasMore(false);
  };
  useEffect(() => {
    getGigs("rating", gigLimit, ["address", "==", address]).then((res) => {
      console.log("now", res);
      setGigs(res);
      if (res.length < gigLimit) setHasMore(false);
    });
    // will get back to this once done with posting gigs as a freelancer
  }, []);

  return (
    <>
      <Navbar />
      <UserGigSidebar>
        <SimpleGrid
          as={InfiniteScroll}
          pageStart={0}
          loadMore={() => gigs.length && fetchMoreGigs()}
          hasMore={hasMore}
          loader={<Spinner ml={"auto"} key={0} color="red.500" />}
          minChildWidth="2xs"
          spacing="40px"
          justifyContent={"center"}
        >
          {gigs.length ? (
            gigs.map((_, i) => {
              return <GigCard content={_} key={i} />;
            })
          ) : (
            <Text>There are no gigs here</Text>
          )}
        </SimpleGrid>
      </UserGigSidebar>
    </>
  );
}

export default Gigs;
