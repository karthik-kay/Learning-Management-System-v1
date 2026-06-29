import { Inline } from "@/components/shared/primitives";
import { ExploreDropdown } from "./ExploreDropdown";
import { NavLink } from "./NavLink";

interface MainNavigationProps {
  mobile?: boolean;
}

export function MainNavigation({ mobile = false }: MainNavigationProps) {
  return (
    <Inline
      justify="start"
      gap={mobile ? 24 : 32}
      className={mobile ? "flex-col items-start" : ""}
    >
      <ExploreDropdown mobile={mobile} />

      <NavLink href="/programs">Programs</NavLink>

      <NavLink href="/certifications">Certifications</NavLink>

      <NavLink href="/placements">Placement</NavLink>
    </Inline>
  );
}
