"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize Xterm
    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#09090b", // zinc-950
        foreground: "#fafafa",
      },
      fontSize: 13,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;

    // Connect to your Django WebSocket
    const socket = new WebSocket("ws://localhost:8000/ws/terminal/");

    socket.onmessage = (event) => term.write(event.data);
    term.onData((data) => socket.send(data));

    // Cleanup
    return () => {
      socket.close();
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="h-full w-full bg-zinc-950" />;
}



