"use client";

import { Box, Inline } from "@/components/shared/primitives";
import { StudentCommunitySidebar } from "../compositions/StudentCommunitySidebar";

export function StudentCommunityShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Inline grow>
      <Box style={{ width: 260, borderRight: "1px solid #eee" }}>
        <StudentCommunitySidebar />
      </Box>

      <Box grow scroll="y">
        {children}
      </Box>
    </Inline>
  );
}
