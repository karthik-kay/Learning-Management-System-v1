"use client";

import { Stack } from "@/components/shared/primitives/Stack";
import { Divider } from "@/components/shared/primitives/Divider";

export function CheckoutLayout({ list, summary, action }: any) {
  return (
    <Stack gap={24}>
      {list}

      <Divider />

      {summary}

      {action}
    </Stack>
  );
}
