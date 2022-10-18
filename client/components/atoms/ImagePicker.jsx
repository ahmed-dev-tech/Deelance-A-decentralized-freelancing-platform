import { Box, Icon, IconButton, Image } from "@chakra-ui/react";
import React from "react";
import { AiFillCamera } from "react-icons/ai";

function ImagePicker({ inputFile, image }) {
  return (
    <Box
      position={"relative"}
      height={"xs"}
      boxShadow={"xs"}
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
        icon={
          <Icon as={AiFillCamera} style={{ color: "gray" }} w={12} h={12} />
        }
        size={"lg"}
        color={"gray"}
        position={"absolute"}
        left={"50%"}
        top={"50%"}
        zIndex={"overlay"}
        transform={"translateX(-50%) translateY(-50%)"}
      />
      <Image
        alt={"Hero Image"}
        fit={"cover"}
        position={"absolute"}
        left={0}
        right={0}
        top={0}
        bottom={0}
        margin={"auto"}
        borderRadius={"full"}
        align={"center"}
        w={"100%"}
        h={"100%"}
        src={image}
      />
    </Box>
  );
}

export default ImagePicker;
