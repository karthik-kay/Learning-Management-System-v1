export enum GoalCategory {
  STUDY = "study",
  COURSE = "course",
  ASSESSMENT = "assessment",
}

export interface Goal {
  id: number;
  title: string;

  goal_type: "progress" | "habit";

  category: GoalCategory;
  category_display: string;

  progress: number;
  target: number;
  deadline?: string | null;
  created_at: string;
  completed: boolean;
  last_checkin_date: string;
}

export interface CreateGoalData {
  title: string;
  category: string;
  goal_type: "progress" | "habit";

  target?: number;
  deadline?: string | null;
}

export interface UpdateGoalData {
  title?: string;
  category?: string;
  goal_type?: "progress" | "habit";
  progress?: number;
  target?: number;
  deadline?: string | null;
}
