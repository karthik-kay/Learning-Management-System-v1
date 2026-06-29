// components/layout/TwoColumnLayout.tsx
import React from "react";

interface TwoColumnLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  reverseOnMobile?: boolean;
}

export const TwoColumnLayout = ({
  children,
  sidebar,
  reverseOnMobile = false,
}: TwoColumnLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      <div
        className={`lg:col-span-8 xl:col-span-9 space-y-8 ${
          reverseOnMobile ? "order-2 lg:order-1" : ""
        }`}
      >
        {children}
      </div>

      <aside
        className={`lg:col-span-4 xl:col-span-3 space-y-6 ${
          reverseOnMobile ? "order-1 lg:order-2" : ""
        }`}
      >
        {sidebar}
      </aside>
    </div>
  );
};
