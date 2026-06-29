"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCertificates } from "@/redux/slices/certificateSlice";
import { Award, Clock, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { certificates, status } = useSelector(
    (state: RootState) => state.certificates,
  );

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-56 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-28 text-center">
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-5 rounded-full mb-5 shadow-inner">
          <Award className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700">
          No certificates yet
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          Complete your first course and your achievement will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
          My Certificates
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {certificates.length} certificate
          {certificates.length > 1 ? "s" : ""} earned
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Glow hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition" />

            {/* Top badge */}
            <div className="absolute top-4 right-4 text-[10px] font-mono bg-slate-900 text-white px-2 py-1 rounded-full tracking-wide">
              {cert.credential_id.slice(0, 8)}
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
              {/* Icon + title */}
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 leading-snug">
                    {cert.course_title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{cert.org.name}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {cert.total_duration}
                </span>
                {cert.course_level && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {cert.course_level}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {new Date(cert.issued_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <Link
                  href={`/student/certificates/${cert.credential_id}`}
                  className="flex items-center gap-1 text-xs font-medium text-slate-700 group-hover:text-yellow-600 transition"
                >
                  View
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
