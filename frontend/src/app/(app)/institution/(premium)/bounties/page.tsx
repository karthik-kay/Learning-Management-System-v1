import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionBountiesPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Bounties"
      description="Manage institution bounties, submissions, leaderboards, and winner status for premium tiers."
      eyebrow="Premium"
      actions={["Bounty list", "Submissions", "Leaderboard", "Winners"]}
    />
  );
}
