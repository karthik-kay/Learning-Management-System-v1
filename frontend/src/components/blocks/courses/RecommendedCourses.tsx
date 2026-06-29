"use client";

import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Users,
  BookOpen,
  Target,
  Gauge,
  Layers,
  Share2,
  Cpu,
  Cloud,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const RecommendedCourses = () => {
  const [coursesPerView, setCoursesPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCoursesPerView(1);
      else if (window.innerWidth < 1280)
        setCoursesPerView(2); // Tablet/Small Desktop
      else setCoursesPerView(3); // Large Desktop
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const courses = [
    {
      id: 1,
      title: "Advanced TypeScript Patterns",
      instructor: "Sarah Chen",
      rating: 4.9,
      students: 12500,
      duration: "8h",
      level: "Advanced",
      price: "Free",
      icon: <Target className="h-5 w-5 text-blue-600" />,
      match: 95,
    },
    {
      id: 2,
      title: "React Performance Optimization",
      instructor: "Mike Johnson",
      rating: 4.8,
      students: 8900,
      duration: "6h",
      level: "Intermediate",
      price: "Premium",
      icon: <Gauge className="h-5 w-5 text-blue-600" />,
      match: 92,
    },
    {
      id: 3,
      title: "Node.js Microservices Architecture",
      instructor: "David Rodriguez",
      rating: 4.7,
      students: 15600,
      duration: "12h",
      level: "Advanced",
      price: "Premium",
      icon: <Layers className="h-5 w-5 text-blue-600" />,
      match: 88,
    },
    {
      id: 4,
      title: "GraphQL API Development",
      instructor: "Emily Watson",
      rating: 4.6,
      students: 6700,
      duration: "10h",
      level: "Intermediate",
      price: "Free",
      icon: <Share2 className="h-5 w-5 text-blue-600" />,
      match: 85,
    },
    {
      id: 5,
      title: "Machine Learning with Python",
      instructor: "Dr. Alex Kumar",
      rating: 4.9,
      students: 22100,
      duration: "16h",
      level: "Beginner",
      price: "Premium",
      icon: <Cpu className="h-5 w-5 text-blue-600" />,
      match: 82,
    },
    {
      id: 6,
      title: "AWS Cloud Architecture",
      instructor: "Jennifer Liu",
      rating: 4.8,
      students: 18900,
      duration: "14h",
      level: "Intermediate",
      price: "Premium",
      icon: <Cloud className="h-5 w-5 text-blue-600" />,
      match: 79,
    },
  ];

  const maxIndex = Math.max(0, courses.length - coursesPerView);
  const nextSlide = () => setCurrentIndex((i) => Math.min(i + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            Recommended for you
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition-all"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition-all"
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* CARDS CONTAINER */}
      <div className="p-6">
        <div className="flex gap-5 transition-transform duration-500 ease-in-out">
          {courses
            .slice(currentIndex, currentIndex + coursesPerView)
            .map((course) => (
              <div
                key={course.id}
                className="flex-1 min-w-0 group flex flex-col bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300"
              >
                {/* TOP: Icon & Match */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    {course.icon}
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] tracking-wider uppercase">
                    {course.match}% Match
                  </Badge>
                </div>

                {/* INFO */}
                <div className="flex-1 space-y-1 mb-5">
                  <h3 className="font-bold text-[15px] leading-snug text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    {course.instructor}
                  </p>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 mb-5">
                  <div className="flex flex-col gap-1 text-center border-r border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">
                      Rating
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-current" />{" "}
                      {course.rating}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-center border-r border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Enrolled
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {course.students > 1000
                        ? `${(course.students / 1000).toFixed(1)}k`
                        : course.students}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Length
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {course.duration}
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-widest">
                    {course.level}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      course.price === "Free"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  >
                    {course.price}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedCourses;
