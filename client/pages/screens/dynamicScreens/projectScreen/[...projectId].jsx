import {
  Box,
  Button,
  Checkbox,
  Flex,
  Progress,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import AddMilestone from "../../../../components/molecules/AddMilestone";
import CompleteMilestone from "../../../../components/molecules/CompleteMilestone";
import Navbar from "../../../../components/molecules/Navbar";
import { ContractContext } from "../../../../context/ContractProvider";
import { FirebaseContext } from "../../../../context/FirebaseProvider";

function ProjectPage(props) {
  const router = useRouter();
  const { projectId } = router.query;

  const { address, contract, getProjectDetailsOnChain, getMilestones } =
    useContext(ContractContext);
  const { getProjectDetails } = useContext(FirebaseContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [projectDetails, setProjectDetails] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const prepareProjectDetails = async () => {
    try {
      const chainProjectDetails = await getProjectDetailsOnChain(projectId[0]);
      const firebaseDetails = await getProjectDetails(
        projectId[1],
        projectId[2],
        projectId[0]
      );
      const chainMilestoneDetails = await getMilestones(projectId[0]);
      for (let i = 0; i < firebaseDetails.milestones.length; i++) {
        firebaseDetails.milestones[i] = {
          ...firebaseDetails.milestones[i],
          ...chainMilestoneDetails[i],
        };
      }
      setProjectDetails({ ...chainProjectDetails, ...firebaseDetails });
    } catch (error) {
      throw error;
    }
  };
  const onBoxChecked = (e) => {
    e.preventDefault();
    !isChecked && onOpen();
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    projectId && contract && prepareProjectDetails();
  }, [projectId, address, contract]);
  console.log(projectDetails);
  return (
    <>
      <Navbar />
      <Box p={5}>
        {projectDetails?.client?.toLowerCase() == address?.toLowerCase() ? (
          <Flex direction={"column"} justifyContent={"space-evenly"}>
            <Progress
              colorScheme="green"
              height="32px"
              value={
                (projectDetails.completedMilestones * 100) /
                projectDetails.milestones.length
              }
            />
            <Box p={5}>
              <Stack spacing={5} direction="column">
                {projectDetails.milestones.map((_, i) => {
                  return (
                    <Box width={"sm"} key={i}>
                      <Checkbox
                        colorScheme="red"
                        defaultChecked={_.completed}
                        disabled={_.completed}
                        onChange={(e) => {
                          onBoxChecked(e);
                        }}
                      >
                        <Text>{_.topic}</Text>
                        <Text>{_.description}</Text>
                      </Checkbox>
                      <Box fontSize="xs" pt={2}>
                        {new Date(_.deadline.toNumber()).toDateString()}
                      </Box>
                      <CompleteMilestone
                        milestoneDetails={_}
                        milestoneId={i}
                        projectId={projectId[0]}
                        isOpen={isOpen}
                        onClose={onClose}
                      />
                    </Box>
                  );
                })}
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
        ) : projectDetails?.freelancer?.toLowerCase() ==
          address?.toLowerCase() ? (
          <Flex direction={"column"} justifyContent={"space-evenly"}>
            <Progress
              colorScheme="green"
              height="32px"
              value={
                (projectDetails.completedMilestones * 100) /
                projectDetails.milestones.length
              }
            />
            <Box p={5}>
              <Stack spacing={5} direction="column">
                {projectDetails.milestones.map((_, i) => {
                  return (
                    <Box width={"sm"} key={i}>
                      <Checkbox
                        colorScheme="red"
                        defaultChecked={_.completed}
                        disabled={true}
                      >
                        <Text>{_.topic}</Text>
                        <Text>{_.description}</Text>
                      </Checkbox>
                      <Box fontSize="xs" pt={2}>
                        {new Date(_.deadline.toNumber()).toDateString()}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Flex>
        ) : (
          <Box>
            <Text>You can't view this work space</Text>
          </Box>
        )}
      </Box>
    </>
  );
}

export default ProjectPage;
