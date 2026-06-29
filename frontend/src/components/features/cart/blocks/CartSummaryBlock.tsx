"use client";

import { Inline } from "@/components/shared/primitives/Inline";

export function CartSummaryBlock({ total }: any) {
  return (
    <Inline justify="between">
      <strong>Total</strong>
      <strong>₹{total}</strong>
    </Inline>
  );
}
