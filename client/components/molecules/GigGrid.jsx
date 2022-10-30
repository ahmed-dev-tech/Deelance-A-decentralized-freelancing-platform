import React from "react";
import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import GigCard from "../../components/atoms/GigCard";

import InfiniteScroll from "react-infinite-scroll-component";

function GigGrid({ displayData, fetchMoreData, params }) {
  return (
    <SimpleGrid
      as={InfiniteScroll}
      dataLength={displayData.data.length}
      next={() => fetchMoreData(params)}
      hasMore={displayData.hasMore}
      loader={<Spinner ml={"auto"} key={0} color="red.500" />}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        maxHeight: "100vh",
        minHeight: "30vh",
      }}
      minChildWidth="2xs"
      spacing="40px"
      justifyContent={"center"}
    >
      {displayData.data.length ? (
        displayData.data.map((_, i) => {
          return (
            <Box p={3} key={i}>
              <GigCard content={_} />
            </Box>
          );
        })
      ) : (
        <Text>There are no gigs here</Text>
      )}
    </SimpleGrid>
  );
}

export default GigGrid;
