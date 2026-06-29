"use client";

import { Inline } from "@/components/shared/primitives/Inline";
import { Stack } from "@/components/shared/primitives/Stack";

export function CheckoutSummaryBlock({ total }: { total: number }) {
  return (
    <Stack gap={8}>
      <Inline justify="between">
        <span>Total</span>
        <strong>₹{total}</strong>
      </Inline>
    </Stack>
  );
}
