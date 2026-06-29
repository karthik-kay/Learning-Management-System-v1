"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { djangoService } from "@/services/djangoService";

type Workspace = {
  id: number;
  name: string;
};

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    djangoService.getWorkspaces().then(setWorkspaces);
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold">Workspaces</h1>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <span>{ws.name}</span>

            <Link href={`/student/ide/${ws.id}`}>
              <button className="bg-secondary px-3 py-1 text-white rounded-md">
                Open
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
