import { HStack, Box, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/FirebaseProvider";
import GigCard from "../atoms/GigCard";
import GigGrid from "./GigGrid";

const ClientTabContent = (props) => {
  const { getGigs, getMoreGigs } = useContext(FirebaseContext);
  const [gigs, setGigs] = useState({
    data: [],
    lastVisible: null,
    hasMore: false,
  });
  const gigLimit = 5;
  useEffect(() => {
    getGigs("rating", gigLimit, [
      "category",
      "==",
      props.category.category,
    ]).then((res) => {
      setGigs({
        data: res.data,
        lastVisible: res.lastVisible,
        hasMore: res.data.length < gigLimit ? false : true,
      });
    });
    // will get back to this once done with posting gigs as a freelancer
  }, [props]);
  console.log(props.category);

  const fetchMoreGigs = async (dataCategory) => {
    let more = await getMoreGigs(gigs.lastVisible, "rating", gigLimit);
    setGigs({
      data: [...gigs.data, ...more.data],
      lastVisible: more.lastVisible,
      hasMore: more.data.length < gigLimit ? false : true,
    });
  };
  console.log(gigs);
  return (
    <Box p={5}>
      {props?.category?.subCategories?.map((subCat, i) => {
        console.log(subCat);
        return (
          <>
            <Heading fontSize="2xl">{subCat}</Heading>
            <Box py={5}>
              <GigGrid
                displayData={gigs}
                fetchMoreData={fetchMoreGigs}
                params={""}
                wrap={false}
              />
              {/* <HStack className="scroll" spacing={8} overflowX="scroll">
                {gigs.length ? (
                  gigs.map((_, i) => {
                    if (_.subCategory == subCat)
                      return <GigCard content={_} key={i} />;
                  })
                ) : (
                  <Text>There are no gigs here</Text>
                )}
              </HStack> */}
            </Box>
          </>
        );
      })}
      {/* <Heading fontSize="2xl">Tech</Heading>
      <Box py={5}>
        <HStack className="scroll" spacing={8} overflowX="scroll">
          {gigs.length ? (
            gigs.map((_, i) => {
              return <GigCard content={_} key={i} />;
            })
          ) : (
            <Text>There are no gigs here</Text>
          )}
        </HStack>
      </Box> */}
    </Box>
  );
};

export default ClientTabContent;
