import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import OrderCard from "../../components/atoms/OrderCard";

import InfiniteScroll from "react-infinite-scroll-component";

function OrderGrid({
  displayData,
  fetchMoreData,
  params,
  wrap,
  filter,
  subCat,
}) {
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
        overflowX: "hidden",
      }}
    >
      <SimpleGrid
        as={InfiniteScroll}
        dataLength={showData.data.length}
        next={() => fetchMoreData(params)}
        hasMore={showData.hasMore}
        loader={<Spinner ml={"auto"} key={0} color="red.500" />}
        style={{
          display: "flex",
          flexWrap: wrap ? "wrap" : "nowrap",
          justifyContent: "space-around",
        }}
        scrollableTarget={`${params}scrolldiv`}
        minChildWidth="2xs"
        spacing="40px"
        justifyContent={"center"}
      >
        {showData.data.length ? (
          showData.data.map((_, i) => {
            return (
              <Box p={3} key={i}>
                <OrderCard content={_} />
              </Box>
            );
          })
        ) : (
          <Text>There are no orders here</Text>
        )}
      </SimpleGrid>
    </Box>
  );
}

export default OrderGrid;
