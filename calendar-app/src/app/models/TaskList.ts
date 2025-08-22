export type Task = {
    id: number;
    title: string;
    deadline?: string;
    completed: boolean;
    subtasks?: Task[];
  }