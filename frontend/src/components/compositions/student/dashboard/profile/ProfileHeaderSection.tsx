// ProfileAvatar
// ProfileBioCard
// ProfileActionButtons
// ProfileStats
// ProfileInfo

import { Box, Stack, Inline } from "@/components/shared/primitives";

import { ProfileAvatar } from "@/components/blocks/profile/ProfileAvatar";
import { ProfileActionButtons } from "@/components/blocks/profile/ProfileActionButtons";
import { ProfileInfoRow } from "@/components/blocks/profile/ProfileInfoRow";
import { ProfileBioBlock } from "@/components/blocks/profile/ProfileBioBlock";
import { ProfileStatsBlock } from "@/components/blocks/profile/ProfileStatsBlock";

import { ProfileStatItem } from "@/types/index";

interface ProfileHeaderSectionProps {
  avatar: {
    name: string;
    imageUrl?: string;
    subtitle?: string;
  };
  info: {
    label: string;
    value: string;
  }[];
  bio?: string;
  stats: ProfileStatItem[];
  onShare?: () => void;
  onDownloadResume?: () => void;
}

export function ProfileHeaderSection({
  avatar,
  info,
  bio,
  stats,
  onShare,
  onDownloadResume,
}: ProfileHeaderSectionProps) {
  return (
    <Box className="rounded-xl border p-6 bg-background">
      <Stack gap={20}>
        <Inline justify="between" align="center">
          <ProfileAvatar {...avatar} />

          <ProfileActionButtons
            onShare={onShare}
            onDownloadResume={onDownloadResume}
          />
        </Inline>

        {/* Info rows */}
        {info.length > 0 && (
          <Stack gap={6}>
            {info.map((item) => (
              <ProfileInfoRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </Stack>
        )}

        {/* Bio */}
        <ProfileBioBlock bio={bio} />

        {/* Stats */}
        <ProfileStatsBlock stats={stats} />
        <ProfileActionButtons />
      </Stack>
    </Box>
  );
}
