// Task
export interface Task {
  id: number;
  title: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  progress: number;
  completed: boolean;
  course: number | null;
}

export interface CreateTaskData {
  title: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  course?: number | null;
}

export interface UpdateTaskData {
  title?: string;
  deadline?: string;
  priority?: "high" | "medium" | "low";
  progress?: number;
  completed?: boolean;
  course?: number | null;
}
