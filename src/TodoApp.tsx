import React, { useState, useEffect, useRef } from "react";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [todoToRemove, setTodoToRemove] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

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
                    as={todo.isCompleted ? "span" : undefined}
                    color={todo.isCompleted ? "gray.500" : "black"}
                    fontWeight={todo.isCompleted ? "normal" : "bold"}
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

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteConfirmation}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              textAlign="center"
              fontWeight="bold"
              color={"red.500"}
            >
              Delete Todo
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteConfirmation}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmRemoveTodo} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default TodoApp;
