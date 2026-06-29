"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Course, PublicCourseDetail } from "@/types";
import { useRouter } from "next/navigation";
import { ContinueCourseItem } from "@/types/enrollment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CourseCardProps {
  href: string;
  thumbnail?: string | null;
  newTab?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CourseCard({
  href,
  thumbnail,
  newTab = false,
  children,
  className = "",
}: CourseCardProps) {
  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block"
    >
      <Card
        className={`
          overflow-hidden rounded-xl border bg-white
          transition hover:shadow-md hover:-translate-y-px
          ${className}
        `}
      >
        {/* IMAGE */}
        <div className="relative w-full h-40 bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Course Thumbnail"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              Course Image
            </div>
          )}
        </div>

        <div className="p-4">{children}</div>
      </Card>
    </Link>
  );
}

//for explore innit
// in your course card file

//for explore innit

export function StudentCourseCard({ course }: any) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { enrollments, enrollmentsStatus } = useSelector(
    (state: RootState) => state.enrollments,
  );

  const isEnrolled =
    enrollmentsStatus === "succeeded"
      ? enrollments.some((e) => e.course_id === course.id)
      : false;

  const price = course.is_free
    ? "Free"
    : `₹${course.active_price?.final_inr ?? 0}`;

  const originalPrice = course.original_price
    ? `₹${course.original_price}`
    : null;

  const handleAddToCart = (e: any) => {
    e.preventDefault();

    dispatch(
      addToCart({
        id: course.id,
        title: course.title,
      }),
    );
  };

  const handleBuyNow = (e: any) => {
    e.preventDefault();

    dispatch(clearCart());
    dispatch(
      addToCart({
        id: course.id,
        title: course.title,
      }),
    );

    setTimeout(() => {
      router.push("/student/checkout");
    }, 100);
  };

  return (
    <Link
      href={
        isEnrolled
          ? `/student/course/${course.id}`
          : `/student/courses/public/${course.id}`
      }
      className="block"
    >
      <div className="border rounded-xl bg-white overflow-hidden hover:shadow-md transition">
        {/* IMAGE */}
        <div className="relative w-full h-40 bg-gray-100">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>

        <div className="p-4">
          {/* TITLE */}
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
            {course.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-xs text-gray-500 line-clamp-2">
            {course.description}
          </p>

          {/* META */}
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <span>{course.level || "All Levels"}</span>
            <span>{course.language || "Language"}</span>
          </div>

          {/* PRICE */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-base font-semibold">{price}</span>

            {originalPrice && !course.is_free && (
              <span className="text-xs text-gray-400 line-through">
                {originalPrice}
              </span>
            )}
          </div>

          {/* CTA */}
          {isEnrolled ? (
            <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg text-sm hover:bg-orange-600 transition">
              Continue Learning
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="mt-4 w-full border rounded-lg py-2 text-sm hover:bg-gray-50 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="mt-2 w-full bg-black text-white rounded-lg py-2 text-sm hover:bg-gray-900 transition"
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
type EnrolledCourseCardData = ContinueCourseItem;
import { Clock } from "lucide-react";

export function EnrolledCourseCard({
  course,
}: {
  course: EnrolledCourseCardData;
}) {
  return (
    <CourseCard
      href={`/student/course/${course.course_id}`}
      thumbnail={course.course_thumbnail}
      newTab
    >
      {/* TITLE */}
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
        {course.course_title}
      </h3>

      {/* SUBTEXT – NEXT UP */}
      <p className="text-xs text-gray-600 line-clamp-2">
        Next: <span className="font-medium">{course.lesson_title}</span>
        <span className="text-gray-400"> • {course.module_title}</span>
      </p>

      {/* META */}
      <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {course.estimated_time_left_minutes} min left
        </span>

        <span>{course.unread_lessons} lessons remaining</span>
      </div>

      {/* PROGRESS */}
      <div className="mt-3">
        <div className="h-1.5 rounded bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-orange-500"
            style={{ width: `${course.course_progress_percent}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-gray-500">
          {course.course_progress_percent}% completed
        </p>
      </div>

      {/* CTA */}
      <button className="mt-4 w-full rounded-lg bg-orange-500 text-white py-2 text-sm font-medium hover:bg-orange-600 transition">
        Resume
      </button>
    </CourseCard>
  );
}

//dunno about it still u know
export function PublicCourseCard({ course }: { course: PublicCourseDetail }) {
  return (
    <CourseCard href={`/courses/${course.id}`} thumbnail={course.thumbnail}>
      <h3 className="text-lg font-semibold line-clamp-2 mb-1">
        {course.title}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>

      <div className="flex justify-between text-xs text-gray-500 mt-3">
        <span>{course.level || "All Levels"}</span>
        <span>{course.language || "Language"}</span>
      </div>
    </CourseCard>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { addToCart, clearCart } from "@/redux/slices/cartSlice";

export function CourseCardSkeleton() {
  return (
    <div className="border rounded-xl bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function StudentCourseCardSkeleton() {
  return (
    <div className="border rounded-xl bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function EnrolledCourseCardSkeleton() {
  return (
    <div className="border rounded-xl bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <div className="border rounded-xl bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
