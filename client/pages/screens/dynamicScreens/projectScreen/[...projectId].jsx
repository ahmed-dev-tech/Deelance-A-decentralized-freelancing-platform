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
import { FirebaseContext } from "../../../../context/FirebaseProvider";

function ProjectPage(props) {
  const router = useRouter();
  const { projectId } = router.query;

  const { address, getProjectDetailsOnChain } = useContext(ContractContext);
  const { getProjectDetails } = useContext(FirebaseContext);

  const [projectDetails, setProjectDetails] = useState({});
  const prepareProjectDetails = async () => {
    try {
      const chainDetails = await getProjectDetailsOnChain(projectId[0]);
      const firebaseDetails = await getProjectDetails(
        projectId[1],
        projectId[2],
        projectId[0]
      );
      setProjectDetails({ ...chainDetails, ...firebaseDetails });
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    console.log(projectId);
    projectId && prepareProjectDetails();
  }, [projectId, address]);
  console.log(projectDetails);
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
              <AddMilestone
                projectId={projectId[0]}
                collection={projectId[1]}
                gigOrderId={projectId[2]}
              />
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
