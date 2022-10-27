import React, { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { ContractContext } from "../../context/ContractProvider";

function CompleteMilestone({
  isOpen,
  onClose,
  milestoneDetails,
  milestoneId,
  projectId,
}) {
  const { milestoneCompleted } = useContext(ContractContext);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{milestoneDetails.topic}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to mark this milestone as completed? This
              will allow payment of{" "}
              {milestoneDetails.isERC
                ? milestoneDetails.payment.toString()
                : ethers.utils.formatEther(
                    milestoneDetails.payment.toString()
                  )}{" "}
              to the freelancer involved
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                milestoneCompleted(projectId, milestoneId);
              }}
            >
              PROCEED
            </Button>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CompleteMilestone;
