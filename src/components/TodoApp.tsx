import React, { useState, useEffect } from "react";
import { Container, Heading, VStack, Text } from "@chakra-ui/react";
import Footer from "./Footer";
import ConfirmationDialog from "./ConfirmationDialog";
import Confetti from "react-confetti";
import TodoList from "./TodoList";
import TodoInput from "./TodoInput";
import TodoActions from "./TodoActions";
import { Todo } from "../types";
import { getTodosFromStorage, saveTodosToStorage } from "../utils/storageUtils";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [todoToRemove, setTodoToRemove] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(false);

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

    if (updatedTodos.find((todo) => todo.id === id && todo.isCompleted)) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
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

  const handleImport = (importedTodos: Todo[]) => {
    const updatedTodos = [...todos, ...importedTodos];
    const uniqueTodos = updatedTodos.filter(
      (todo, index, self) => index === self.findIndex((t) => t.id === todo.id)
    );
    setTodos(uniqueTodos);
    saveTodosToStorage(uniqueTodos);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="md" mt={8}>
      <Heading mb={6} textAlign="center">
        Todo List
      </Heading>
      <VStack spacing={4} align="stretch">
        <TodoActions
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleImport={handleImport}
          todos={todos}
        />
        <TodoInput
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleAddTodo={handleAddTodo}
        />
        <TodoList
          todos={filteredTodos}
          handleToggleTodo={handleToggleTodo}
          openDeleteConfirmation={openDeleteConfirmation}
        />
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

      {confetti && <Confetti />}
    </Container>
  );
};

export default TodoApp;
