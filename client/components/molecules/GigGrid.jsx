import React, { useState } from "react";
import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import GigCard from "../../components/atoms/GigCard";

import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from "react";

function GigGrid({ displayData, fetchMoreData, params, wrap, filter, subCat }) {
  const [showData, setShowData] = useState({
    data: [],
    lastVisible: null,
    hasMore: false,
  });
  useEffect(() => {
    let dataArr = displayData.data.filter((_, i) => {
      return !filter || (filter && _.subCategory == subCat);
    });
    setShowData({
      ...displayData,
      data: dataArr,
      hasMore: displayData.hasMore && dataArr.length ? true : false,
    });
  }, [displayData]);

  return (
    <Box
      id={`${params}scrolldiv`}
      className="scroll"
      style={{
        maxHeight: "100vh",
        minHeight: "30vh",
        overflowX: wrap ? "hidden" : "scroll",
      }}
    >
      <SimpleGrid
        as={InfiniteScroll}
        dataLength={showData.data.length}
        next={() => fetchMoreData(params)}
        hasMore={showData.hasMore}
        scrollableTarget={`${params}scrolldiv`}
        loader={<Spinner m={"auto"} key={0} color="red.500" />}
        style={{
          display: "flex",
          flexWrap: wrap ? "wrap" : "nowrap",
          justifyContent: "space-around",
        }}
        className="scroll"
        minChildWidth="2xs"
        spacing="40px"
        justifyContent={"center"}
      >
        {showData.data.length ? (
          showData.data.map((_, i) => {
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
    </Box>
  );
}

export default GigGrid;
