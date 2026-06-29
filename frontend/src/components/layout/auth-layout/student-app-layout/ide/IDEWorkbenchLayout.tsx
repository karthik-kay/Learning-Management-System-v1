"use client";

import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

type IDEWorkbenchLayoutProps = {
  explorer: React.ReactNode;
  editor: React.ReactNode;
  auxiliary: React.ReactNode;
  bottom: React.ReactNode;
};

export function IDEWorkbenchLayout({
  explorer,
  editor,
  auxiliary,
  bottom,
}: IDEWorkbenchLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="h-full">
        <ResizablePanelGroup orientation="vertical" className="h-full">
          {/* TOP AREA */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel defaultSize={20}>
                  <div className="h-full">{explorer}</div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={50}>
                  <div className="h-full">{editor}</div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={30}>
                  <div className="h-full">{auxiliary}</div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* BOTTOM */}
          <ResizablePanel defaultSize={25} minSize={10}>
            <div className="h-full">{bottom}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
