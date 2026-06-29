"use client";

import { CartSummaryBlock } from "../blocks/CartSummaryBlock";
import { Stack } from "@/components/shared/primitives/Stack";

export function CartSummary({ total }: any) {
  return (
    <Stack gap={16}>
      <CartSummaryBlock total={total} />
    </Stack>
  );
}
