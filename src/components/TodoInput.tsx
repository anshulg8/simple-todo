import React from "react";
import { HStack, Input, Button } from "@chakra-ui/react";

interface TodoInputProps {
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: () => void;
}

const TodoInput: React.FC<TodoInputProps> = ({
  newTodo,
  setNewTodo,
  handleAddTodo,
}) => {
  return (
    <HStack mb={4}>
      <Input
        placeholder="Enter a new task"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <Button colorScheme="teal" onClick={handleAddTodo}>
        Add
      </Button>
    </HStack>
  );
};

export default TodoInput;
