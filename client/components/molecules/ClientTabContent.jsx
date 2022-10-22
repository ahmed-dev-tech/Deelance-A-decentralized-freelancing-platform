import { Stack, HStack, VStack, Box, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/FirebaseProvider";
import GigCard from "../atoms/GigCard";
import InfiniteScroll from "react-infinite-scroller";

const ClientTabContent = (props) => {
  const { getGigs, getMoreGigs } = useContext(FirebaseContext);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    getGigs("rating", 10, ["category", "==", props.category]).then((res) => {
      setGigs(res);
    });
    // will get back to this once done with posting gigs as a freelancer
  }, []);
  const fetchMoreGigs = async () => {
    const res = await getMoreGigs(gigs[gigs.length - 1]);
    setGigs([...gigs, ...res]);
  };
  return (
    <Box p={5}>
      <Heading fontSize="2xl">Tech</Heading>
      <Box py={5}>
        {/* <InfiniteScroll
          pageStart={0}
          loadMore={fetchMoreGigs}
          hasMore={true || false}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}
        >
          <HStack
            style={{ scrollbarWidth: "none" }}
            spacing={8}
            overflowX="scroll"
          >
            {gigs.length ? (
              gigs.map((_, i) => {
                return <GigCard content={_} key={i} />;
              })
            ) : (
              <Text>There are no gigs here</Text>
            )}
          </HStack>
        </InfiniteScroll> */}
      </Box>
    </Box>
  );
};

export default ClientTabContent;
