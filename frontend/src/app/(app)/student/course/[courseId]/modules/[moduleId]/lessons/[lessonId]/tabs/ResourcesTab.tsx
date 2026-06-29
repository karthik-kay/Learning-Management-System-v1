interface Props {
  lessonId: string;
}

export function ResourcesTab({ lessonId }: Props) {
  return (
    <ul className="list-disc ml-6 text-sm text-gray-700">
      <li>Slides.pdf</li>
      <li>External reference</li>
      <li>GitHub repository</li>
    </ul>
  );
}
