"use client";

import { Inline } from "@/components/shared/primitives/Inline";
import { Stack } from "@/components/shared/primitives/Stack";

export function CartItemBlock({ course, onRemove }: any) {
  return (
    <Inline justify="between">
      <Stack gap={4}>
        <span>{course.title}</span>

        <small>₹{course.active_price?.final_inr ?? "Free"}</small>
      </Stack>

      <button onClick={() => onRemove(course.id)}>Remove</button>
    </Inline>
  );
}
