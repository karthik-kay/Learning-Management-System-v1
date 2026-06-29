import { FeatureCard } from "@/components/public/widgets/cards/FeatureCard";
import { Box, Grid, Stack } from "@/components/shared/primitives";

interface Feature {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string; // link for the cta button
  active?: boolean; // active/selected state
  onClick?: () => void; // click handler
  className?: string; // per-card custom styling
}

interface SimpleFeatureProps {
  title?: string;
  description?: string;
  features: Feature[];
  className?: string;
}

export default function SimpleFeatureSection({
  title,
  description,
  features,
  className,
}: SimpleFeatureProps) {
  return (
    <Stack gap={48} className={className}>
      {title && <Box>{title}</Box>}
      {description && <Box>{description}</Box>}{" "}
      <Grid className=" grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" gap={32}>
        {" "}
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            ctaLabel={feature.ctaLabel}
            active={feature.active}
            onClick={feature.onClick}
            className={feature.className}
          />
        ))}
      </Grid>
    </Stack>
  );
}
