import { Container, Stack, Box } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LogoCloudProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function LogoCloudSection({
  title,
  description,
  actions,
  children,
  className,
}: LogoCloudProps) {
  return (
    <section className={cn("py-8 md:py-16", className)}>
      <Container>
        {" "}
        <Stack gap={48}>
          {(title || description || actions) && (
            <Stack gap={16} align="center" className="text-center">
              {title && <Box>{title}</Box>}

              {description && <Box>{description}</Box>}

              {actions && <Box>{actions}</Box>}
            </Stack>
          )}

          {children}
        </Stack>
      </Container>
    </section>
  );
}
