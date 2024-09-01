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
  VStack,
} from "@chakra-ui/react";
import Footer from "./Footer";
import ConfirmationDialog from "./ConfirmationDialog";
import { Todo } from "../types";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [todoToRemove, setTodoToRemove] = useState<number | null>(null);

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

  const handleToggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
    saveTodosToStorage(updatedTodos);
  };

  const openDeleteConfirmation = (id: number) => {
    setTodoToRemove(id);
    setIsDialogOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setTodoToRemove(null);
    setIsDialogOpen(false);
  };

  const confirmRemoveTodo = () => {
    if (todoToRemove !== null) {
      const updatedTodos = todos.filter((todo) => todo.id !== todoToRemove);
      setTodos(updatedTodos);
      saveTodosToStorage(updatedTodos);
      closeDeleteConfirmation();
    }
  };

  // Export tasks to a JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${+new Date()}-tasks.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Import tasks from a JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const importedTodos: Todo[] = JSON.parse(content);
          const updatedTodos = [...todos, ...importedTodos];
          setTodos(updatedTodos);
          saveTodosToStorage(updatedTodos);
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file);
    }
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
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Button colorScheme="blue" onClick={handleExport}>
            Export Tasks
          </Button>
          <Input
            type="file"
            accept=".json"
            onChange={handleImport}
            display="none"
            id="import-tasks"
          />
          <Button as="label" htmlFor="import-tasks" colorScheme="green">
            Import Tasks
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
                      as={todo.isCompleted ? "span" : undefined}
                      color={todo.isCompleted ? "gray.500" : "black"}
                      fontWeight={todo.isCompleted ? "normal" : "bold"}
                      textDecoration={
                        todo.isCompleted ? "line-through" : "none"
                      }
                    >
                      {todo.text}
                    </Text>
                  </HStack>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => openDeleteConfirmation(todo.id)}
                  >
                    Remove
                  </Button>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>
      <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
        Your tasks are stored safely in your browser's local storage and never
        leave your device.
      </Text>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmRemoveTodo}
        title="Delete Todo"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />

      <Footer />
    </Container>
  );
};

export default TodoApp;
