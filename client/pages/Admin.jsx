import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/molecules/Navbar";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
} from "@chakra-ui/react";
import { FirebaseContext } from "../../context/FirebaseProvider";

function Admin(props) {
  const { addCategory } = useContext(FirebaseContext);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCategory = async () => {
    setIsSubmitting(true);
    await addCategory(newCategory);
    setIsSubmitting(false);
    setNewCategory("");
  };
  return (
    <>
      <Navbar />
      {/* Will remove this later and allow automatic addition of categories according to number of active users */}
      <FormControl>
        <FormLabel>Enter new category</FormLabel>
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          type="text"
        />
        <FormHelperText>Add a category</FormHelperText>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          onClick={submitCategory}
        >
          Add
        </Button>
      </FormControl>
    </>
  );
}

export default Admin;
