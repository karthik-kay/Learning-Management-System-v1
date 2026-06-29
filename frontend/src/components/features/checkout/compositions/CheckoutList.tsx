"use client";

import { Stack } from "@/components/shared/primitives/Stack";
import { CheckoutItemBlock } from "../blocks/CheckoutItemBlock";

export function CheckoutList({ items, courses }: any) {
  const cartCourses = courses.filter((course: any) =>
    items.some((item: any) => item.id === course.id),
  );

  return (
    <Stack gap={12}>
      {cartCourses.map((course: any) => (
        <CheckoutItemBlock key={course.id} course={course} />
      ))}
    </Stack>
  );
}
