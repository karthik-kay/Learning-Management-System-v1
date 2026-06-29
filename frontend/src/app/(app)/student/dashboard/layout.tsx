export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col max-w-9xl">
      <div className="flex-1 flex w-full  flex-col gap-6 overflow-y-auto px-6  py-6 min-h-0 goals-scroll">
        <div className="w-full mx-auto space-y-8 ">{children}</div>
      </div>
    </div>
  );
}
