"use client";

import { useState } from "react";
import { Stack } from "@/components/shared/primitives/Stack";
import { PanelTabs } from "@/components/blocks/ide/PanelTabs";
import { PanelTab } from "@/components/blocks/ide/PanelTab";
import { Terminal } from "@/components/blocks/ide/Terminal";

export function BottomPanel() {
  const [activeTab, setActiveTab] = useState("terminal"); // Default to terminal to test it

  return (
    <Stack grow className="h-full overflow-hidden bg-zinc-950 text-white">
      <PanelTabs>
        <PanelTab
          label="Output"
          active={activeTab === "output"}
          onClick={() => setActiveTab("output")}
        />
        <PanelTab
          label="Terminal"
          active={activeTab === "terminal"}
          onClick={() => setActiveTab("terminal")}
        />
        <PanelTab
          label="Problems"
          active={activeTab === "problems"}
          onClick={() => setActiveTab("problems")}
        />
      </PanelTabs>

      <Stack grow className="relative">
        {activeTab === "output" && (
          <div className="p-4 text-zinc-400 font-mono text-sm">
            Output goes here...
          </div>
        )}

        {activeTab === "terminal" && (
          <div className="absolute inset-0">
            <Terminal />
          </div>
        )}

        {activeTab === "problems" && (
          <div className="p-4 text-zinc-400 font-mono text-sm">
            No problems detected.
          </div>
        )}
      </Stack>
    </Stack>
  );
}
