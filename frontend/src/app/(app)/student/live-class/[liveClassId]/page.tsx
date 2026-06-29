"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function LiveClassPage() {
  const { liveClassId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useSelector((s: RootState) => s.user.profile);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!user || !user.username) return; // 🔑 WAIT FOR USER

    let api: any;

    const loadJitsi = () => {
      if (
        typeof window === "undefined" ||
        typeof window.JitsiMeetExternalAPI !== "function"
      ) {
        setTimeout(loadJitsi, 100);
        return;
      }

      api = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName: `lms-demo-room-${liveClassId}`,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",

        userInfo: {
          email: user.email,
          displayName: user.username,
        },

        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          readOnlyName: true,
          disableProfile: true,
        },

        interfaceConfigOverwrite: {
          DISABLE_DISPLAY_NAME: true, // 🔒 prevent rename
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: false,
          DEFAULT_REMOTE_DISPLAY_NAME: user.username,

          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "chat",
            "raisehand",
            "tileview",
            "hangup",
          ],
        },
      });
      api.addEventListener("displayNameChange", (event: any) => {
        if (event.displayname !== user.username) {
          api.executeCommand("displayName", user.username);
        }
      });
    };

    loadJitsi();

    return () => {
      api?.dispose();
    };
  }, [liveClassId, user]); // 🔑 DEPENDS ON USER

  return (
    <main className="fixed inset-0 bg-black">
      <div ref={containerRef} className="w-full h-full" />
    </main>
  );
}
