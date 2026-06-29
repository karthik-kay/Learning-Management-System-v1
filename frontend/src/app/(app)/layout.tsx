import { ReactNode } from "react";
import Script from "next/script";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* JITSI SCRIPT – loads once for all app pages */}
      <Script
        src="https://meet.jit.si/external_api.js"
        strategy="afterInteractive"
      />

      <div className="flex">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
