"use client";

import { CartItemBlock } from "../blocks/CartItemBlock";
import { Stack } from "@/components/shared/primitives/Stack";

export function CartList({ items, courses, onRemove }: any) {
  const cartCourses = courses.filter((course: any) =>
    items.some((item: any) => item.id === course.id),
  );

  return (
    <Stack gap={16}>
      {cartCourses.map((course: any) => (
        <CartItemBlock key={course.id} course={course} onRemove={onRemove} />
      ))}
    </Stack>
  );
}
