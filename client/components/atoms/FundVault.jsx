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
  Input,
  Flex,
} from "@chakra-ui/react";
import Select from "react-select";
import { useContext } from "react";
import { useState } from "react";
import { UtilitiesContext } from "../../context/UtilitiesProvider";
import { ContractContext } from "../../context/ContractProvider";

function FundVault() {
  const { fundVault } = useContext(ContractContext);
  const { mumbaiTokens } = useContext(UtilitiesContext);
  const [amount, setAmount] = useState({ value: null, token: "native" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Fund Vault</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fund your Deelance Vault</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Enter Amount</FormLabel>
              <Flex justifyContent="left" alignContent="center">
                <Input
                  placeholder="Enter amount"
                  width={"3xs"}
                  onChange={(e) =>
                    setAmount({ ...amount, value: e.target.value })
                  }
                  type="number"
                />
                <Select
                  onChange={(e) => setAmount({ ...amount, token: e.value })}
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={() => fundVault(amount.value, amount.token)}
            >
              FUND
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default FundVault;
