from django.contrib import admin

from public_content.models import (
    BlogCategory,
    BlogPost,
    CareerPath,
    CareerPathStage,
    FAQ,
    PublicContentBlock,
    PublicDomain,
    PublicEvent,
    PublicPage,
    Roadmap,
    RoadmapStep,
    RoadmapTrack,
)


class PublishableAdmin(admin.ModelAdmin):
    list_filter = ("status", "is_featured")
    readonly_fields = ("created_at", "updated_at", "published_at")
    search_fields = ("title",)


class PublicContentBlockInline(admin.TabularInline):
    model = PublicContentBlock
    extra = 0
    fields = (
        "section_key",
        "title",
        "status",
        "display_order",
        "cta_label",
        "cta_url",
    )


class FAQInline(admin.TabularInline):
    model = FAQ
    extra = 0
    fields = ("question", "category", "status", "display_order")


@admin.register(PublicPage)
class PublicPageAdmin(PublishableAdmin):
    list_display = ("title", "page_key", "status", "is_featured", "display_order")
    list_filter = ("status", "page_key", "is_featured")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "hero_title", "meta_title")
    inlines = [PublicContentBlockInline, FAQInline]


@admin.register(PublicContentBlock)
class PublicContentBlockAdmin(PublishableAdmin):
    list_display = ("section_key", "page", "title", "status", "display_order")
    list_filter = ("status", "page", "section_key")
    search_fields = ("section_key", "title", "subtitle", "body")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "page", "category", "status", "display_order")
    list_filter = ("status", "page", "category")
    search_fields = ("question", "answer")
    readonly_fields = ("created_at", "updated_at", "published_at")


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "display_order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "description")


@admin.register(BlogPost)
class BlogPostAdmin(PublishableAdmin):
    list_display = ("title", "category", "status", "is_featured", "published_at")
    list_filter = ("status", "is_featured", "category")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "excerpt", "body", "author_name")


@admin.register(PublicDomain)
class PublicDomainAdmin(PublishableAdmin):
    list_display = ("title", "slug", "status", "is_featured", "display_order")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "description")


class CareerPathStageInline(admin.TabularInline):
    model = CareerPathStage
    extra = 0
    fields = ("title", "expected_salary_lpa", "display_order")


@admin.register(CareerPath)
class CareerPathAdmin(PublishableAdmin):
    list_display = (
        "title",
        "domain",
        "role_family",
        "level",
        "average_salary_lpa",
        "status",
        "is_featured",
        "display_order",
    )
    list_filter = ("status", "is_featured", "domain", "level")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "subtitle", "short_description", "description")
    filter_horizontal = (
        "recommended_programs",
        "recommended_courses",
        "related_roadmaps",
    )
    inlines = [CareerPathStageInline]


@admin.register(CareerPathStage)
class CareerPathStageAdmin(admin.ModelAdmin):
    list_display = ("title", "career_path", "expected_salary_lpa", "display_order")
    list_filter = ("career_path",)
    search_fields = ("title", "description")


class RoadmapStepInline(admin.TabularInline):
    model = RoadmapStep
    extra = 0
    fields = ("track", "title", "stage_type", "duration_label", "display_order")


class RoadmapTrackInline(admin.TabularInline):
    model = RoadmapTrack
    extra = 0
    fields = ("title", "focus_area", "display_order")


@admin.register(Roadmap)
class RoadmapAdmin(PublishableAdmin):
    list_display = (
        "title",
        "domain",
        "roadmap_type",
        "level",
        "status",
        "is_featured",
        "display_order",
    )
    list_filter = ("status", "is_featured", "domain", "roadmap_type", "level")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "subtitle", "description")
    filter_horizontal = ("recommended_programs", "recommended_courses")
    inlines = [RoadmapTrackInline, RoadmapStepInline]


@admin.register(RoadmapTrack)
class RoadmapTrackAdmin(admin.ModelAdmin):
    list_display = ("title", "roadmap", "focus_area", "display_order")
    list_filter = ("roadmap",)
    search_fields = ("title", "description", "focus_area")


@admin.register(RoadmapStep)
class RoadmapStepAdmin(admin.ModelAdmin):
    list_display = ("title", "roadmap", "track", "stage_type", "duration_label", "display_order")
    list_filter = ("roadmap", "track", "stage_type")
    search_fields = ("title", "description")


@admin.register(PublicEvent)
class PublicEventAdmin(PublishableAdmin):
    list_display = (
        "title",
        "event_type",
        "starts_at",
        "status",
        "is_featured",
        "display_order",
    )
    list_filter = ("status", "is_featured", "event_type", "starts_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "short_description", "description", "mentor_name")
    filter_horizontal = ("related_programs", "related_courses")
