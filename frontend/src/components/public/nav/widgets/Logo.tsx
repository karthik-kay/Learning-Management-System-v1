import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="
        inline-flex
        items-center
        gap-3
        
      "
    >
      <Image
        src="/vaarada_logo.png"
        alt="LearnerSlate Logo"
        width={160}
        height={160}
        priority
      />
    </Link>
  );
}
