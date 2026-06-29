"use client";

import { Stack } from "@/components/shared/primitives/Stack";
import { CheckoutSummaryBlock } from "../blocks/CheckoutSummaryBlock";

export function CheckoutSummary({ total }: { total: number }) {
  return (
    <Stack gap={16}>
      <CheckoutSummaryBlock total={total} />
    </Stack>
  );
}
