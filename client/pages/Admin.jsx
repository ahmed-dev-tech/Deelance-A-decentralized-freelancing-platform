import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/molecules/Navbar";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import Select from "react-select";
import { FirebaseContext } from "../context/FirebaseProvider";

function Admin(props) {
  const { addCategory, addSubCategory, categories } =
    useContext(FirebaseContext);
  const [newCategory, setNewCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCategory = async () => {
    setIsSubmitting(true);
    await addCategory(newCategory);
    setIsSubmitting(false);
    setNewCategory("");
  };
  const submitSubCategory = async () => {
    setIsSubmitting(true);
    await addSubCategory(category, subCategory);
    setIsSubmitting(false);
    setSubCategory("");
  };
  useEffect(() => {
    setCategory(categories[0]?.category);
  }, [categories]);
  return (
    <>
      <Navbar />
      {/* Will remove this later and allow automatic addition of categories according to number of active users */}
      <Text>Category</Text>
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
      <Text>Sub Category</Text>
      <FormControl isRequired>
        <FormLabel>Select Category</FormLabel>
        <Select
          onChange={(e) => {
            setCategory(e.value);
          }}
          className="basic-single"
          classNamePrefix="select"
          defaultValue={
            categories.map((_) => {
              return { value: _.category, label: _.category.toUpperCase() };
            })[0]
          }
          isClearable={true}
          isSearchable={true}
          name="category"
          options={categories.map((_) => {
            return { value: _.category, label: _.category.toUpperCase() };
          })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Enter new sub category</FormLabel>
        <Input
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          type="text"
        />
        <FormHelperText>Add a sub category</FormHelperText>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          onClick={submitSubCategory}
        >
          Add
        </Button>
      </FormControl>
    </>
  );
}

export default Admin;
