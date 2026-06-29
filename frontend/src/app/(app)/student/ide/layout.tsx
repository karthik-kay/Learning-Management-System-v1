"use client";
export default function IdeLayout({ children }: { children: React.ReactNode }) {
  return <div className=" flex flex-col h-full max-w-9xl p-4">{children}</div>;
}
