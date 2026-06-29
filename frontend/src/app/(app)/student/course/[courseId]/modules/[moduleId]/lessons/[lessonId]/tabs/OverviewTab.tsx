interface Props {
  lessonId: string;
}

export function OverviewTab({ lessonId }: Props) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-semibold mb-2">Lesson Overview</h2>
      <p className="text-sm text-gray-600">
        Overview content for lesson {lessonId}.
      </p>
    </div>
  );
}
