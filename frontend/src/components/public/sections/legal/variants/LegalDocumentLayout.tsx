import { Grid } from "@/components/shared/primitives";
import { LegalTableOfContents, LegalTocItem } from "@/components/public/widgets/legal/LegalTableOfContents";
import { ReactNode } from "react";

interface LegalDocumentLayoutProps {
  toc: LegalTocItem[];
  children: ReactNode;
}

export function LegalDocumentLayout({
  toc,
  children,
}: LegalDocumentLayoutProps) {
  return (
    <Grid className="grid-cols-1 gap-12 lg:grid-cols-[260px_1fr] lg:items-start">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <LegalTableOfContents items={toc} />
        </div>
      </aside>

      <article className="min-w-0">{children}</article>
    </Grid>
  );
}
