"use client";

interface EmptyPageProps {
  message: string;
}

export function EmptyPage({ message }: EmptyPageProps) {
  return (
    <div className="text-center py-20 text-gray-500 text-lg">{message}</div>
  );
}
