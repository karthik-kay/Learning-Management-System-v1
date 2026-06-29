import { PublicCourseDetail } from "@/types";

interface ProductSidebarProps {
  course: PublicCourseDetail;
  isEnrolled: boolean;
}

export default function ProductSidebar({
  course,
  isEnrolled,
}: ProductSidebarProps) {
  return (
    <div className="p-4 rounded-lg border bg-white">
      {isEnrolled ? (
        <a
          href={`/student/courses/${course.id}`}
          className="block bg-blue-600 text-white text-center rounded-lg py-3 font-semibold"
        >
          Continue Learning
        </a>
      ) : (
        <>
          <div className="text-3xl font-bold mb-4">
            {course.is_free ? "Free" : `₹${course.price}`}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg mb-2">
            Enroll Now
          </button>

          <button className="w-full border py-3 rounded-lg">
            Add to Wishlist
          </button>
        </>
      )}
    </div>
  );
}
