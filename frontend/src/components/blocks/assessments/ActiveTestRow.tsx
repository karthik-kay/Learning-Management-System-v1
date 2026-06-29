import { ActiveTestListItem } from "./AcitveTestListItem";

// components/student/assessments/tests/ActiveTestListItem.tsx
interface Props {
  title: string;
  courseName: string;
  moduleName: string;
  duration: string;
  totalQuestions: number;
  attemptsLeft: number;
  status: "Active" | "Upcoming" | "Expired";
  dueDate: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  instructor: string;
}
export const ActiveTestRow = () => {
  const activeTests: Props[] = [
    {
      title: "Redux State Management",
      courseName: "Advanced React Suite",
      moduleName: "Global State",
      duration: "45 mins",
      totalQuestions: 30,
      instructor: "Dr. Sarah Johnson",
      attemptsLeft: 2,
      level: "Advanced",
      status: "Active",
      dueDate: "Sep 28",
    },
    {
      title: "Redux State Management",
      courseName: "Advanced React Suite",
      moduleName: "Global State",
      duration: "45 mins",
      totalQuestions: 30,
      instructor: "Dr. Sarah Johnson",
      attemptsLeft: 2,
      level: "Advanced",
      status: "Active",
      dueDate: "Sep 28",
    },
    {
      title: "Python Data Structures",
      courseName: "Computer Science 101",
      moduleName: "Lists & Tuples",
      duration: "30 mins",
      totalQuestions: 20,
      instructor: "Prof. Mike Chen",
      attemptsLeft: 1,
      level: "Intermediate",
      status: "Active",
      dueDate: "Sep 25",
    },
  ] as const;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Active Assessments
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Currently available for attempt
          </p>
        </div>
        <button className="text-xs font-bold text-indigo-600 hover:underline">
          View Schedule
        </button>
      </div>

      {/* Optimized Grid for 70/30 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeTests.map((test, index) => (
          <ActiveTestListItem key={index} {...test} />
        ))}
      </div>
    </section>
  );
};
