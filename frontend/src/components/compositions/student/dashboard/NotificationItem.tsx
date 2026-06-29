import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function NotificationCard({
  title,
  message,
  time,
}: {
  title: string;
  message: string;
  time: string;
}) {
  return (
    <Card className="rounded-xl border shadow-sm p-4 flex gap-4">
      <div className="flex items-center gap-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Zap className="text-primary" size={20} />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-primary">{title}</h3>
          <p className="text-xs text-text-muted">{message}</p>
          <p className="text-xs text-text-muted mt-1">{time}</p>
        </div>
      </div>
    </Card>
  );
}

export function NotificationRow({
  title,
  message,
  time,
}: {
  title: string;
  message: string;
  time: string;
}) {
  return (
    <div className="flex  justify-start px-4 gap-4 py-2 border-b items-center last:border-b-0">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Zap className="text-primary" size={18} />
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <span className="text-xs text-gray-400 mt-1">{time}</span>
      </div>
    </div>
  );
}
