import {
  Box,
  Button,
  Checkbox,
  Flex,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import AddMilestone from "../../../../components/molecules/AddMilestone";
import Navbar from "../../../../components/molecules/Navbar";
import { ContractContext } from "../../../../context/ContractProvider";

function ProjectPage(props) {
  const router = useRouter();
  const { projectId } = router.query;

  const { address, getProjectDetailsOnChain } = useContext(ContractContext);

  const [projectDetails, setProjectDetails] = useState({});
  useEffect(() => {
    projectId &&
      getProjectDetailsOnChain(projectId).then((res) => setProjectDetails(res));
  }, [projectId, address]);
  return (
    <>
      <Navbar />
      <Box p={5}>
        {projectDetails?.client?.toLowerCase() == address?.toLowerCase() ? (
          <Flex direction={"column"} justifyContent={"space-evenly"}>
            <Progress colorScheme="green" height="32px" value={20} />
            <Box p={5}>
              <Stack spacing={5} direction="column">
                <Checkbox colorScheme="red" defaultChecked>
                  Checkbox
                </Checkbox>
                <Checkbox colorScheme="red" defaultChecked>
                  Checkbox
                </Checkbox>
              </Stack>
            </Box>
            <Box pos="fixed" bottom="10" right="10">
              <AddMilestone projectId={projectId} />
            </Box>
          </Flex>
        ) : (
          <Box></Box>
        )}
      </Box>
    </>
  );
}

export default ProjectPage;
