import React from "react";
import { HStack, Input, IconButton, Tooltip } from "@chakra-ui/react";
import { FaFileImport, FaFileExport } from "react-icons/fa";
import { Todo } from "../types";

interface TodoActionsProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleImport: (importedTodos: Todo[]) => void;
  todos: Todo[];
}

const TodoActions: React.FC<TodoActionsProps> = ({
  searchQuery,
  setSearchQuery,
  handleImport,
  todos,
}) => {
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

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const importedTodos: Todo[] = JSON.parse(content);
          handleImport(importedTodos);
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <HStack justify="space-between">
      <Input
        placeholder="Search tasks"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Tooltip label="Export" aria-label="Export Tasks">
        <IconButton
          aria-label="Export Tasks"
          icon={<FaFileExport />}
          colorScheme="blue"
          onClick={handleExport}
        />
      </Tooltip>
      <Tooltip label="Import" aria-label="Import Tasks">
        <IconButton
          as="label"
          htmlFor="import-tasks"
          aria-label="Import Tasks"
          icon={<FaFileImport />}
          colorScheme="green"
        />
      </Tooltip>
      <Input
        type="file"
        accept=".json"
        onChange={handleFileImport}
        display="none"
        id="import-tasks"
      />
    </HStack>
  );
};

export default TodoActions;
