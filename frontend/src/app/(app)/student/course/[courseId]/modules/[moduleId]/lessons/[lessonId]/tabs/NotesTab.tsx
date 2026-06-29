interface Props {
  lessonId: string;
}

export function NotesTab({ lessonId }: Props) {
  return (
    <div className="max-w-3xl">
      <textarea
        placeholder="Write your notes here..."
        className="w-full h-64 border rounded-md p-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}
