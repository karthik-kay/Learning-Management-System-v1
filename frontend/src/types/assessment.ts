export interface AssessmentCard {
  id: number;
  title: string;
  course: string;

  score: number;
  maxScore: number;

  date: string;
  timeSpent: string;

  status: "excellent" | "good" | "needs-improvement";
  improvement: number;
  topics: string[];
}
