"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Inline, Stack, Box } from "@/components/shared/primitives";

interface PrimaryDashboardCTAProps {
  label: string;
  description: string;
  actionLabel: string;
  href: string;
  loading?: boolean;
  className?: string;
}

export function PrimaryDashboardCTA({
  label,
  description,
  actionLabel,
  href,
  loading = false,
  className,
}: PrimaryDashboardCTAProps) {
  if (loading) {
    return (
      <Box className={className}>
        <Inline justify="between">
          <Stack>
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-3 w-[450px]" />
          </Stack>
          <Skeleton className="h-10 w-40" />
        </Inline>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <Inline justify="between">
        <Stack>
          <h3>{label}</h3>
          <p>{description}</p>
        </Stack>

        <Link href={href}>
          <Button variant="link">
            {actionLabel}
            <MoveRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </Inline>
    </Box>
  );
}
