import React from "react";
import Image from "next/image";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)]  grid grid-cols-1 gap-x-32 lg:grid-cols-2 px-8 py-8  ">
      {/* LEFT SIDE IMAGE */}
      <div className=" hidden border-2 lg:block relative bg-white/10">
        <Image
          src="/register_pageIcon.png"
          alt="Auth Illustration"
          fill
          className="border object-contain object-center bg-none"
          priority
        />
      </div>

      <div
        className="w-full items-center px-8
       py-8 justify-center"
      >
        {children}
      </div>
    </div>
  );
}
