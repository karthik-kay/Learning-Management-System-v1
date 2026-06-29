import AssessmentsNav from "@/components/compositions/student/assessments/AssessmentsNav";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b">
        <AssessmentsNav />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0 goals-scroll">
        <div className="max-w-7xl mx-auto space-y-8 ">{children}</div>
      </div>
    </div>
  );
}
