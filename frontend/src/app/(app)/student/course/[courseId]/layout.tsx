import { ReactNode } from "react";

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <div className="flex gap-8 px-6 py-6">
      <main className="flex-1">{children}</main>
    </div>
  );
}
