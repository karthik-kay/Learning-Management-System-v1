import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from public_content.models import (
    CareerPath,
    PublicDomain,
    Roadmap,
    RoadmapStep,
    RoadmapTrack,
)


SEED_DIR = Path(__file__).resolve().parents[2] / "seeds"
PUBLISHED = "published"


class Command(BaseCommand):
    help = "Import public content seed data for domains, roadmaps, and career paths."

    def add_arguments(self, parser):
        parser.add_argument(
            "--seed-dir",
            default=str(SEED_DIR),
            help="Directory containing domains.json, roadmaps.json, and career_paths.json.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        seed_dir = Path(options["seed_dir"])

        domains = self.load_json(seed_dir / "domains.json")
        roadmaps = self.load_json(seed_dir / "roadmaps.json")
        careers = self.load_json(seed_dir / "career_paths.json")

        domain_map = self.import_domains(domains)
        roadmap_map = self.import_roadmaps(roadmaps, domain_map)
        career_count = self.import_career_paths(careers, domain_map, roadmap_map)

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported public content: {len(domain_map)} domains, "
                f"{len(roadmap_map)} roadmaps, {career_count} career paths."
            )
        )

    def load_json(self, path):
        if not path.exists():
            raise FileNotFoundError(f"Seed file not found: {path}")

        return json.loads(path.read_text(encoding="utf-8"))

    def import_domains(self, domains):
        domain_map = {}

        for item in domains:
            domain, _ = PublicDomain.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "title": item["title"],
                    "description": item.get("description", ""),
                    "icon": item.get("icon", ""),
                    "color": item.get("color", ""),
                    "status": PUBLISHED,
                    "is_featured": item.get("is_featured", False),
                    "display_order": item.get("display_order", 0),
                    "payload": item.get("payload", {}),
                },
            )
            domain_map[domain.slug] = domain

        return domain_map

    def import_roadmaps(self, roadmaps, domain_map):
        roadmap_map = {}

        for item in roadmaps:
            domain = domain_map.get(item.get("domain"))
            roadmap, _ = Roadmap.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "title": item["title"],
                    "subtitle": item.get("subtitle", ""),
                    "description": item.get("description", ""),
                    "domain": domain,
                    "roadmap_type": item.get("roadmap_type", Roadmap.RoadmapType.DOMAIN),
                    "level": item.get("level", Roadmap.Level.BEGINNER),
                    "estimated_duration_weeks": item.get("estimated_duration_weeks", 0),
                    "skills": item.get("skills", []),
                    "tools": item.get("tools", []),
                    "outcomes": item.get("outcomes", []),
                    "status": PUBLISHED,
                    "is_featured": item.get("is_featured", False),
                    "display_order": item.get("display_order", 0),
                    "payload": item.get("payload", {}),
                },
            )
            roadmap_map[roadmap.slug] = roadmap

            RoadmapTrack.objects.filter(roadmap=roadmap).delete()
            RoadmapStep.objects.filter(roadmap=roadmap).delete()

            for track_data in item.get("tracks", []):
                track = RoadmapTrack.objects.create(
                    roadmap=roadmap,
                    title=track_data["title"],
                    slug=track_data.get("slug", ""),
                    description=track_data.get("description", ""),
                    focus_area=track_data.get("focus_area", ""),
                    skills=track_data.get("skills", []),
                    tools=track_data.get("tools", []),
                    display_order=track_data.get("display_order", 0),
                    payload=track_data.get("payload", {}),
                )

                for step_data in track_data.get("steps", []):
                    RoadmapStep.objects.create(
                        roadmap=roadmap,
                        track=track,
                        title=step_data["title"],
                        description=step_data.get("description", ""),
                        stage_type=step_data.get("stage_type", ""),
                        duration_label=step_data.get("duration_label", ""),
                        concepts=step_data.get("concepts", []),
                        skills=step_data.get("skills", []),
                        tools=step_data.get("tools", []),
                        projects=step_data.get("projects", []),
                        resources=step_data.get("resources", []),
                        display_order=step_data.get("display_order", 0),
                        payload=step_data.get("payload", {}),
                    )

        return roadmap_map

    def import_career_paths(self, careers, domain_map, roadmap_map):
        imported = 0

        for item in careers:
            domain = domain_map.get(item.get("domain"))
            career_path, _ = CareerPath.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "title": item["title"],
                    "subtitle": item.get("subtitle", ""),
                    "short_description": item.get("short_description", ""),
                    "description": item.get("description", ""),
                    "domain": domain,
                    "role_family": item.get("role_family", ""),
                    "level": item.get("level", CareerPath.Level.BEGINNER),
                    "demand_label": item.get("demand_label", ""),
                    "opportunity_count_label": item.get("opportunity_count_label", ""),
                    "average_salary_lpa": item.get("average_salary_lpa"),
                    "salary_min_lpa": item.get("salary_min_lpa"),
                    "salary_max_lpa": item.get("salary_max_lpa"),
                    "hiring_companies": item.get("hiring_companies", []),
                    "skills": item.get("skills", []),
                    "tools": item.get("tools", []),
                    "responsibilities": item.get("responsibilities", []),
                    "prerequisites": item.get("prerequisites", []),
                    "highlights": item.get("highlights", []),
                    "status": PUBLISHED,
                    "is_featured": item.get("is_featured", False),
                    "display_order": item.get("display_order", 0),
                    "payload": item.get("payload", {}),
                },
            )

            related_roadmaps = [
                roadmap_map[slug]
                for slug in item.get("related_roadmaps", [])
                if slug in roadmap_map
            ]
            career_path.related_roadmaps.set(related_roadmaps)
            imported += 1

        return imported
