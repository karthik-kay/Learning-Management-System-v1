import { Box, Grid, Stack } from "@/components/shared/primitives";
import { ProfileStatItem } from "@/types/index";

interface ProfileStatsBlockProps {
  stats: ProfileStatItem[];
}

export function ProfileStatsBlock({ stats }: ProfileStatsBlockProps) {
  return (
    <Box className="rounded-lg border p-4">
      <Grid columns="repeat(auto-fit, minmax(120px, 1fr))" gap={16}>
        {stats.map((stat) => (
          <Stack key={stat.label} gap={4} align="center">
            <span className="text-lg font-semibold">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            {stat.helper && (
              <span className="text-[11px] text-muted-foreground">
                {stat.helper}
              </span>
            )}
          </Stack>
        ))}
      </Grid>
    </Box>
  );
}
