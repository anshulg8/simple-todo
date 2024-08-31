import React, { useState, useEffect } from "react";
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

// Utility functions to interact with localStorage
const getTodosFromStorage = (): Todo[] => {
  const storedTodos = localStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const saveTodosToStorage = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Load todos from localStorage on component mount
  useEffect(() => {
    const storedTodos = getTodosFromStorage();
    setTodos(storedTodos);
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo,
        isCompleted: false,
      };
      const updatedTodos = [...todos, newTodoItem];
      setTodos(updatedTodos);
      saveTodosToStorage(updatedTodos);
      setNewTodo("");
    }
  };

  const handleRemoveTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToStorage(updatedTodos);
  };

  const handleToggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
    saveTodosToStorage(updatedTodos);
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
        <Button colorScheme="teal" onClick={handleAddTodo}>
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
                    onChange={() => handleToggleTodo(todo.id)}
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
                  onClick={() => handleRemoveTodo(todo.id)}
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
