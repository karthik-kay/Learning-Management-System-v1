"use client";

import Image from "next/image";

export function CheckoutItemBlock({ course }: any) {
  const price = course.active_price?.final_inr || 0;
  const original = course.active_price?.original_inr || price;
  const discount = original - price;

  return (
    <div className="flex gap-4 border rounded-2xl p-4 bg-background hover:shadow-md transition">
      {/* IMAGE */}
      <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
        <Image
          src={course.thumbnail || "/placeholder.jpg"}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1 flex flex-col justify-between">
        {/* TOP */}
        <div>
          <h3 className="font-semibold text-base line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            {course.domain} • {course.level}
          </p>
        </div>

        {/* BOTTOM */}
        <div className="flex items-center justify-between mt-3">
          {/* PRICE */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">₹{price}</span>

            {original > price && (
              <>
                <span className="text-sm line-through text-muted-foreground">
                  ₹{original}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {Math.round((discount / original) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* BADGE */}
          {course.is_free && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md">
              FREE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
