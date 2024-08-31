import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Heading,
  HStack,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo, isCompleted: false },
      ]);
      setNewTodo("");
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  return (
    <Container maxW="md" mt={8}>
      <Heading mb={6} textAlign="center">
        Todo List
      </Heading>
      <HStack mb={4}>
        <Input
          placeholder="Enter a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button colorScheme="teal" onClick={addTodo}>
          Add
        </Button>
      </HStack>
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <List spacing={3}>
          {todos.map((todo) => (
            <ListItem key={todo.id}>
              <HStack justify="space-between">
                <HStack>
                  <Checkbox
                    isChecked={todo.isCompleted}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <Text
                    as={todo.isCompleted ? "s" : undefined}
                    color={todo.isCompleted ? "gray.500" : "black"}
                  >
                    {todo.text}
                  </Text>
                </HStack>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeTodo(todo.id)}
                >
                  Remove
                </Button>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default TodoApp;
