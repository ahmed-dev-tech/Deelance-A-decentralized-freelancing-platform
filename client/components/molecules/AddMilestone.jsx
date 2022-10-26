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
} from "@chakra-ui/react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useState } from "react";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import { ContractContext } from "../../context/ContractProvider";

function AddMilestone({ projectId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mumbaiTokens } = useContext(UtilitiesContext);
  const { address, addMilestone } = useContext(ContractContext);
  const [startDate, setStartDate] = useState(new Date());
  const [milestoneBudget, setMilestoneBudget] = useState({
    value: 0,
    token: "native",
  });

  const submitMilestone = async () => {
    await addMilestone(
      projectId,
      Date.parse(startDate),
      milestoneBudget.token == "native",
      milestoneBudget.token == "native" ? address : milestoneBudget.token,
      milestoneBudget.value,
      milestoneBudget.value
    );
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
                  width={"xs"}
                  mr={"3"}
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
            <Button colorScheme="blue" mr={3} onClick={submitMilestone}>
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
