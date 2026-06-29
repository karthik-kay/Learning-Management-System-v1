import { ReactNode } from "react";

import { Stack } from "@/components/shared/primitives";
import { Navbar } from "@/components/public/nav/Navbar";
import { Footer } from "@/components/public/nav/Footer";

interface Props {
  children: ReactNode;
}

export function FormLayout({ children }: Props) {
  return (
    <Stack gap={0}>
      <Navbar />

      <main>
        <Stack className="gap-16 lg:gap-24"></Stack>{" "}
      </main>

      <Footer />
    </Stack>
  );
}
