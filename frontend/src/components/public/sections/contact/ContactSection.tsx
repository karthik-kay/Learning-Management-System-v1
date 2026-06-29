// sections/contact/ContactSection.tsx

import { ReactNode } from "react";

import { Container, Stack, Box } from "@/components/shared/primitives";

interface ContactSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ContactSection({
  title,
  description,
  actions,
  children,
  className,
}: ContactSectionProps) {
  return (
    <section className={className}>
      <Container>
        <Stack gap={48}>
          {(title || description) && (
            <Stack gap={16} align="center" className="text-center">
              {title}
              {description}
            </Stack>
          )}

          {children}

          {actions && <Box className="text-center">{actions}</Box>}
        </Stack>
      </Container>
    </section>
  );
}
