import { Box, Icon, IconButton, Image } from "@chakra-ui/react";
import React from "react";
import { AiFillCamera } from "react-icons/ai";

function ImagePicker({ inputFile, image }) {
  return (
    <Box
      position={"relative"}
      height={"xs"}
      boxShadow={"2xl"}
      width={"xs"}
      borderRadius={"full"}
      overflow={"hidden"}
    >
      <IconButton
        onClick={() => {
          inputFile.current.click();
        }}
        aria-label={"Play Button"}
        variant={"ghost"}
        _hover={{ bg: "transparent" }}
        icon={<Icon as={AiFillCamera} w={12} h={12} />}
        size={"lg"}
        color={"white"}
        position={"absolute"}
        left={"50%"}
        top={"50%"}
        transform={"translateX(-50%) translateY(-50%)"}
      />
      <Image
        alt={"Hero Image"}
        fit={"cover"}
        borderRadius={"full"}
        align={"center"}
        // w={"100%"}
        // h={"100%"}
        src={image}
      />
    </Box>
  );
}

export default ImagePicker;
