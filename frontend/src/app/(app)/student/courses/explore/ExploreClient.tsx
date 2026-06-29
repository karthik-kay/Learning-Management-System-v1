"use client";

import { useMemo, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { PublicCourseDetail } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { fetchEnrollments } from "@/redux/slices/enrollmentsSlice";

import {
  SearchFilters,
  FilterState,
} from "@/components/courses/common/SearchFilters";

import { ExploreCourseGrid } from "@/components/compositions/student/student-course/explore/ExploreCourseGrid";
import { EmptyCourses } from "@/components/common/empty-states";

export default function ExploreClient({
  courses,
}: {
  courses: PublicCourseDetail[];
}) {
  const dispatch = useDispatch<AppDispatch>();

  // Next.js routing hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const enrollmentStatus = useSelector(
    (s: RootState) => s.enrollments.enrollmentsStatus,
  );

  useEffect(() => {
    if (enrollmentStatus === "idle") {
      dispatch(fetchEnrollments());
    }
  }, [dispatch, enrollmentStatus]);

  // 1. READ: Construct the filter state directly from the URL params
  const currentFilters: FilterState = useMemo(() => {
    return {
      searchQuery: searchParams.get("q") || "",
      domain: searchParams.get("domain") || "",
      skillLevel: searchParams.get("level") || "",
      language: searchParams.get("lang") || "",
      priceRange: [
        Number(searchParams.get("minPrice")) || 0,
        searchParams.get("maxPrice")
          ? Number(searchParams.get("maxPrice"))
          : 9999,
      ],
      hasCertificate: searchParams.get("cert") === "true",
    };
  }, [searchParams]);

  // 2. WRITE: When your shadcn/ui filter component triggers a change, update the URL
  const handleFilterChange = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or delete params based on the new filter state
    if (newFilters.searchQuery) params.set("q", newFilters.searchQuery);
    else params.delete("q");

    if (newFilters.domain) params.set("domain", newFilters.domain);
    else params.delete("domain");

    if (newFilters.skillLevel) params.set("level", newFilters.skillLevel);
    else params.delete("level");

    if (newFilters.language) params.set("lang", newFilters.language);
    else params.delete("lang");

    // Handle price range array
    if (newFilters.priceRange[0] > 0)
      params.set("minPrice", String(newFilters.priceRange[0]));
    else params.delete("minPrice");

    if (newFilters.priceRange[1] < 9999)
      params.set("maxPrice", String(newFilters.priceRange[1]));
    else params.delete("maxPrice");

    if (newFilters.hasCertificate) params.set("cert", "true");
    else params.delete("cert");

    // Replace the URL silently. Using replace is better here so users don't
    // have to click the back button 50 times to undo every single filter click.
    router.replace(`${pathname}?${params.toString()}`);
  };

  // 3. FILTER: Exactly the same as before, but using currentFilters
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (
        currentFilters.searchQuery &&
        !c.title
          .toLowerCase()
          .includes(currentFilters.searchQuery.toLowerCase())
      )
        return false;

      if (currentFilters.domain && c.domain !== currentFilters.domain)
        return false;
      if (currentFilters.skillLevel && c.level !== currentFilters.skillLevel)
        return false;
      if (currentFilters.language && c.language !== currentFilters.language)
        return false;

      const price = c.is_free ? 0 : c.active_price?.final_inr || 0;
      if (price < currentFilters.priceRange[0]) return false;
      if (price > currentFilters.priceRange[1]) return false;

      return true;
    });
  }, [courses, currentFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-muted-foreground">
            Discover new skills, level up, and build your future 🚀
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-12 gap-6">
          {/* FILTER SIDEBAR */}
          {/* FILTER SIDEBAR */}
          {/* FILTER SIDEBAR */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-background rounded-2xl border shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] flex flex-col overflow-hidden">
              {/* Sidebar Header: shrink-0 makes sure this never gets squished */}
              <div className="p-5 pb-4 border-b shrink-0 bg-background z-10">
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Scrollable area: flex-1 takes up the remaining space, overflow-y-auto handles the scroll */}
              <div className="p-5 overflow-y-auto flex-1">
                <SearchFilters
                  value={currentFilters}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="col-span-12 lg:col-span-9 space-y-6">
            {/* RESULTS BAR */}
            <div className="flex items-center justify-between bg-background border rounded-xl px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredCourses.length}
                </span>{" "}
                courses
              </p>

              {currentFilters.searchQuery && (
                <span className="text-sm text-muted-foreground">
                  Results for:{" "}
                  <span className="font-medium text-foreground">
                    "{currentFilters.searchQuery}"
                  </span>
                </span>
              )}
            </div>

            {/* COURSES */}
            <div className="bg-background rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
              {filteredCourses.length > 0 ? (
                <ExploreCourseGrid courses={filteredCourses} />
              ) : (
                <EmptyCourses message="No courses match your filters." />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
