export type TodoItem = {
  id: string;
  text: string;
  done?: boolean;
};

export type TodosByDay = Record<string, TodoItem[]>;
