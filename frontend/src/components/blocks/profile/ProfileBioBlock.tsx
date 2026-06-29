import { Box, Stack } from "@/components/shared/primitives";

interface ProfileBioBlockProps {
  bio?: string;
}

export function ProfileBioBlock({ bio }: ProfileBioBlockProps) {
  if (!bio) return null;

  return (
    <Box className="rounded-lg border p-4 bg-background">
      <Stack gap={8}>
        <span className="text-sm font-medium">About</span>
        <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
      </Stack>
    </Box>
  );
}
