interface Props {
  lessonId: string;
}

export function TranscriptTab({ lessonId }: Props) {
  return (
    <div className="max-w-3xl h-[400px] overflow-y-auto border rounded-md p-4 text-sm">
      <p className="mb-2">
        <span className="text-gray-400">00:00</span> Welcome to the lesson…
      </p>
      <p className="mb-2">
        <span className="text-gray-400">01:10</span> Explanation starts…
      </p>
    </div>
  );
}
