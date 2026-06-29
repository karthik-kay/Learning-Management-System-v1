import Link from "next/link";
import { Stack } from "@/components/shared/primitives";

export interface LegalTocItem {
  id: string;
  label: string;
}

interface LegalTableOfContentsProps {
  items: LegalTocItem[];
}

export function LegalTableOfContents({ items }: LegalTableOfContentsProps) {
  return (
    <nav aria-label="Table of contents">
      <Stack gap={14}>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Table of Contents
        </p>
        <Stack gap={9}>
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium leading-relaxed text-slate-500 transition hover:text-orange-600"
            >
              {index + 1}. {item.label}
            </Link>
          ))}
        </Stack>
      </Stack>
    </nav>
  );
}
