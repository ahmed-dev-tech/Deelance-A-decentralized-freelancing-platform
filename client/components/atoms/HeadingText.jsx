import { Heading, Text } from "@chakra-ui/react";
import React from "react";

function HeadingText({ children }) {
  return (
    <Heading
      lineHeight={1.1}
      fontWeight={600}
      fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
    >
      <Text
        as={"span"}
        position={"relative"}
        _after={{
          content: "''",
          width: "full",
          height: "30%",
          position: "absolute",
          bottom: 1,
          left: 0,
          bg: "blue.400",
          zIndex: -1,
        }}
      >
        {children}
      </Text>
    </Heading>
  );
}

export default HeadingText;
