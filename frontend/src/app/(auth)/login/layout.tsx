import React from "react";
import Image from "next/image";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] grid grid-cols-1 gap-x-16 lg:grid-cols-2 px-4 md:px-16 py-8  ">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden lg:block relative bg-white/10">
        <Image
          src="/register_pageIcon.png"
          alt="Auth Illustration"
          fill
          className="border object-contain object-center bg-none"
          priority
        />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex items-center ">
        <div
          className="w-full bg-white   max-w-md md:max-w-lg lg:max-w-xl  border rounded-md shadow-[2px_3px_rgba(0,0,0,0.5)] mx-auto    px-8
       py-8  "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
