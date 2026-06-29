export interface MonthlyStats {
  learning_hours: number;
  modules_completed: number;
  assessments_passed: number;
}

export interface DashboardData {
  lifetime_learning_hours: number;
  day_streak: number;
  last_active: string | null;
  total_points: number;
  monthly_stats?: MonthlyStats | null;
}

// types/profileStats.ts
export interface ProfileStatItem {
  label: string;
  value: string | number;
  helper?: string;
}
