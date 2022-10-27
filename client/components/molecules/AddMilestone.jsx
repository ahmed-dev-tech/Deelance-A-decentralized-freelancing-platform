import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useState } from "react";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import { ContractContext } from "../../context/ContractProvider";
import { FirebaseContext } from "../../context/FirebaseProvider";

function AddMilestone({ projectId, collection, gigOrderId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mumbaiTokens } = useContext(UtilitiesContext);
  const { address, addMilestone } = useContext(ContractContext);
  const { addMilestoneToProject } = useContext(FirebaseContext);

  const [milestoneBio, setMilestoneBio] = useState({
    topic: "",
    description: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [milestoneBudget, setMilestoneBudget] = useState({
    value: 0,
    token: "native",
  });
  const [isSaving, setIsSaving] = useState(false);

  const submitMilestone = async () => {
    setIsSaving(true);
    try {
      await addMilestone(
        projectId,
        Date.parse(startDate),
        milestoneBudget.token != "native",
        milestoneBudget.token == "native" ? address : milestoneBudget.token,
        milestoneBudget.token == "native"
          ? milestoneBudget.value
          : Number(milestoneBudget.value)
      );
      await addMilestoneToProject(
        collection,
        gigOrderId,
        projectId,
        milestoneBio
      );
    } catch (error) {
      throw error;
    }
    setIsSaving(false);
  };
  return (
    <>
      <Button
        onClick={onOpen}
        rounded={"full"}
        size={"lg"}
        fontWeight={"normal"}
        px={6}
      >
        ADD MILESTONE
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Milestone</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>What's the topic</FormLabel>
              <Input
                value={milestoneBio.topic}
                onChange={(e) =>
                  setMilestoneBio({ ...milestoneBio, topic: e.target.value })
                }
                borderTop={"none"}
                borderRight={"none"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Describe the milestone</FormLabel>
              <Textarea
                value={milestoneBio.description}
                onChange={(e) =>
                  setMilestoneBio({
                    ...milestoneBio,
                    description: e.target.value,
                  })
                }
                borderTop={"none"}
                borderRight={"none"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Pick a deadline</FormLabel>
              <DatePicker
                selected={startDate}
                showTimeSelect
                dateFormat="Pp"
                onChange={(date) => {
                  setStartDate(date);
                }} //only when value has changed
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>What's your budget</FormLabel>
              <Flex justifyContent="left" alignContent="center">
                <Input
                  type={"number"}
                  width={"3xs"}
                  mr={"3"}
                  borderTop={"none"}
                  borderX={"none"}
                  onChange={(e) =>
                    setMilestoneBudget({
                      ...milestoneBudget,
                      value: e.target.value,
                    })
                  }
                />
                <Select
                  onChange={(e) =>
                    setMilestoneBudget({ ...milestoneBudget, token: e.value })
                  }
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={mumbaiTokens[0]}
                  isClearable={true}
                  isSearchable={true}
                  name="category"
                  options={mumbaiTokens}
                />
              </Flex>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={submitMilestone}
              isLoading={isSaving}
            >
              ADD
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
export default AddMilestone;
