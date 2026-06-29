import { Inline } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";

interface ProfileActionButtonsProps {
  onShare?: () => void;
  onDownloadResume?: () => void;
}

export function ProfileActionButtons({
  onShare,
  onDownloadResume,
}: ProfileActionButtonsProps) {
  return (
    <Inline gap={8}>
      {onShare && (
        <Button size="sm" variant="outline" onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      )}
      {onDownloadResume && (
        <Button size="sm" onClick={onDownloadResume}>
          <Download className="mr-2 h-4 w-4" />
          Resume
        </Button>
      )}
    </Inline>
  );
}
