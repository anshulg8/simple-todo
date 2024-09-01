import React from "react";
import {
  Box,
  HStack,
  List,
  ListItem,
  Checkbox,
  Text,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { Todo } from "../types";

interface TodoListProps {
  todos: Todo[];
  handleToggleTodo: (id: number) => void;
  openDeleteConfirmation: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  handleToggleTodo,
  openDeleteConfirmation,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      {todos.length > 0 ? (
        <List spacing={3}>
          {todos.map((todo) => (
            <ListItem key={todo.id}>
              <HStack justify="space-between">
                <HStack flex="1" overflow="hidden">
                  <Checkbox
                    isChecked={todo.isCompleted}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <Text
                    as={todo.isCompleted ? "span" : undefined}
                    color={todo.isCompleted ? "gray.500" : "black"}
                    fontWeight={todo.isCompleted ? "normal" : "bold"}
                    textDecoration={todo.isCompleted ? "line-through" : "none"}
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {todo.text}
                  </Text>
                </HStack>
                <IconButton
                  aria-label="Remove Task"
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => openDeleteConfirmation(todo.id)}
                  ml={4}
                />
              </HStack>
            </ListItem>
          ))}
        </List>
      ) : (
        <VStack spacing={4} align="center">
          <Text color="gray.500">No tasks available.</Text>
          <Text color="gray.500">Start by creating some tasks!</Text>
        </VStack>
      )}
    </Box>
  );
};

export default TodoList;
