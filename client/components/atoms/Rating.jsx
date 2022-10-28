import React from "react";
import { Box } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

function Rating({ rating, numReviews }) {
  return (
    <Box d="flex" mt="2" alignItems="center">
      {Array(5)
        .fill("")
        .map((_, i) => (
          <StarIcon key={i} color={i < rating ? "teal.500" : "gray.300"} />
        ))}
      <Box as="span" ml="2" color="gray.600" fontSize="sm">
        {numReviews} reviews
      </Box>
    </Box>
  );
}
export default Rating;
