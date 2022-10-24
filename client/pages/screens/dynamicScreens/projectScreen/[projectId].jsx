import { Box, Button, Checkbox, Text } from "@chakra-ui/react";
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

  const [projectDetails, setProjectDetails] = useState([]);
  useEffect(() => {
    projectId &&
      getProjectDetailsOnChain(projectId).then((res) => setProjectDetails(res));
  }, [projectId, address]);
  console.log(projectDetails);

  return (
    <>
      <Navbar />
      <Box p={5}>
        {address == projectDetails?.client || projectDetails?.freelancer ? (
          <Box>
            {address == projectDetails.freelancer &&
              projectDetails.approved == false && (
                <Button pos="fixed" bottom="10" right="10">
                  JOIN PROJECT
                </Button>
              )}
            {
              address == projectDetails.client && <Text>hello</Text>
              //   <Box pos="fixed" bottom="10" right="10">
              //     <AddMilestone />
              //   </Box>
            }
          </Box>
        ) : (
          <Box>You are not allowed to view this workspace</Box>
        )}
      </Box>
    </>
  );
}

export default ProjectPage;
