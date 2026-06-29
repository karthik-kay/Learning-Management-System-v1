"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface Props {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  rating: number;
  hours: number;
}

export function RecommendationCourseCard({
  id,
  title,
  thumbnail,
  category,
  rating,
  hours,
}: Props) {
  return (
    <Link
      href={`/courses/${id}`}
      className="min-w-[260px] bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative h-36 w-full">
        <Image src={thumbnail} alt={title} fill className="object-cover" />
      </div>

      <div className="p-4 space-y-1">
        <span className="text-xs text-orange-500 font-medium">{category}</span>

        <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {rating}
          </div>
          <span>•</span>
          <span>{hours}h</span>
        </div>
      </div>
    </Link>
  );
}
