import Link from "next/link";

import { Stack, Inline } from "@/components/shared/primitives";

interface AuthNavigationProps {
  mobile?: boolean;
}

export function AuthNavigation({ mobile = false }: AuthNavigationProps) {
  if (mobile) {
    return (
      <Stack gap={16}>
        <Link href="/login" className="inline-flex justify-center">
          Login
        </Link>

        <Link
          href="/register"
          className="
    inline-flex
    items-center
    rounded-lg
    bg-orange-500
    px-4
    py-2
    text-sm
    font-medium
    text-white
    transition-colors
    hover:bg-orange-600
  "
        >
          Join For Free
        </Link>
      </Stack>
    );
  }

  return (
    <Inline gap={16}>
      <Link href="/login">Login</Link>

      <Link
        href="/register"
        className="
          rounded-lg
          bg-orange-500
          px-4
          py-2
          text-white
          text-[16px]
        "
      >
        Join For Free
      </Link>
    </Inline>
  );
}
