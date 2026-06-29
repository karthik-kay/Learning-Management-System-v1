export interface QuizOption {
  id: number;
  text: string;
  is_correct?: boolean;
}

export type QuestionType = "mcq" | "true_false" | "short" | "long" | "fill";

export interface QuizQuestion {
  id: number;
  text: string;
  question_type: QuestionType;
  marks: number;
  order: number;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  title: string;
  instructions: string;
  due_date: string | null;
  questions: QuizQuestion[];
}

export interface QuizAnswerSubmit {
  question: number;
  selected_option?: number;
  text_answer?: string;
}

export interface QuizSubmitPayload {
  answers: QuizAnswerSubmit[];
}

export interface QuizAnswer {
  question: number;
  question_text: string;
  question_type: QuestionType;

  selected_option: number | null;
  selected_option_text: string | null;

  text_answer: string | null;

  correct_option: string | null;
}

export interface QuizAttempt {
  id: number;
  quiz: number;
  quiz_title: string;
  max_score: number;

  score: number;
  started_at: string;
  completed_at: string;

  answers: QuizAnswer[];
}

export type QuizHistoryItem = QuizAttempt;

export interface CreateQuizData {
  course: number;
  module?: number | null;
  lesson?: number | null;
  title: string;
  instructions?: string;
  due_date?: string | null;

  questions: {
    text: string;
    question_type: QuestionType;
    marks: number;
    order: number;
    options?: {
      text: string;
      is_correct: boolean;
    }[];
    correct_answer?: string | null;
  }[];
}
