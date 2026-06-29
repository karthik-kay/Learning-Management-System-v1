import { ReactNode } from "react";
import { Menu } from "lucide-react";

interface MobileDrawerProps {
  links?: ReactNode;

  actions?: ReactNode;

  className?: string;
}

import { Stack, Divider } from "@/components/shared/primitives";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileDrawerProps {
  links?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function MobileDrawer({ links, actions, className }: MobileDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex items-center justify-center"
          aria-label="Open Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className={className}>
        <Stack gap={24} className="pt-8 p-4">
          {links}

          {actions && (
            <>
              <Divider />

              {actions}
            </>
          )}
        </Stack>
      </SheetContent>
    </Sheet>
  );
}
