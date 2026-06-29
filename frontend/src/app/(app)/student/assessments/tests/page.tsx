// app/assessments/tests/page.tsx
import { StatsOverviewBar } from "@/components/compositions/student/assessments/tests/StatsOverviewBar";
import { TwoColumnLayout } from "@/components/blocks/assessments/TwoColumnLayout";
import { ActiveTestRow } from "@/components/blocks/assessments/ActiveTestRow";
import { CategorySection } from "@/components/compositions/student/assessments/tests/CategorySection";
import { AssessmentList } from "@/components/compositions/student/assessments/tests/AssessmentList";

export default function TestsPage() {
  return (
    <div className="p-6">
      <header className="mb-8 px-1">
        <h1 className="text-3xl font-black text-slate-900">Assessments</h1>
        <p className="text-slate-500 font-medium">
          Pick up exactly where you left off, bruv.
        </p>
      </header>

      <TwoColumnLayout
        sidebar={
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Deadlines</h3>
            <p className="text-sm text-slate-400 italic text-center py-4">
              No urgent deadlines
            </p>
          </div>
        }
      >
        <StatsOverviewBar />

        {/* Now this is just one clean line */}
        <ActiveTestRow />

        <section className="space-y-6">
          <CategorySection />
        </section>
        <AssessmentList />
      </TwoColumnLayout>
    </div>
  );
}
