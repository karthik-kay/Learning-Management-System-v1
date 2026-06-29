interface ProfileAvatarProps {
  name: string;
  imageUrl?: string;
  subtitle?: string;
}

import { Stack, Inline } from "@/components/shared/primitives";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ProfileAvatar({
  name,
  imageUrl,
  subtitle,
}: ProfileAvatarProps) {
  return (
    <Inline gap={12} align="center">
      <Avatar>
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <Stack gap={4}>
        <span className="font-medium">{name}</span>
        {subtitle && (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        )}
      </Stack>
    </Inline>
  );
}
