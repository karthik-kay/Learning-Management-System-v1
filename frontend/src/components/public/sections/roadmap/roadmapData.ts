import { RoadmapDetail, RoadmapListItem } from "@/types";

export interface PublicRoadmapCardData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  domain: string;
  isFeatured?: boolean;
  level: string;
  duration: string;
  stepsCount: number;
  skills: string[];
  tools: string[];
  outcome: string;
  recommendedProgram: string;
  salaryRange: string;
}

export interface PublicRoadmapStepData {
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
  projects?: string[];
}

export interface PublicRoadmapTrackData {
  title: string;
  slug: string;
  description: string;
  focusArea: string;
  skills: string[];
  tools: string[];
  steps: PublicRoadmapStepData[];
}

export interface PublicRelatedCareerPathData {
  title: string;
  slug: string;
  roleFamily: string;
  salary: string;
  demand: string;
  skills: string[];
}

export interface PublicRoadmapCourseData {
  title: string;
  slug: string;
  instructor: string;
  duration: string;
  level: string;
}

export interface PublicRoadmapDetailData extends PublicRoadmapCardData {
  overview: string;
  steps: PublicRoadmapStepData[];
  tracks?: PublicRoadmapTrackData[];
  projects?: string[];
  responsibilities?: string[];
  courses?: PublicRoadmapCourseData[];
  relatedCareerPaths?: PublicRelatedCareerPathData[];
  faqs: { question: string; answer: string }[];
}

function weeksToDuration(weeks: number) {
  if (!weeks) return "Self-paced";
  if (weeks < 4) return `${weeks} weeks`;
  const months = Math.round(weeks / 4);
  return `${months} months`;
}

function asStringList(value: unknown[] | undefined) {
  if (!value?.length) return [];

  return value.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && "title" in item) {
      return String(item.title);
    }
    if (item && typeof item === "object" && "label" in item) {
      return String(item.label);
    }
    return String(item);
  });
}

export function mapRoadmapListItemToCard(
  roadmap: RoadmapListItem,
): PublicRoadmapCardData {
  return {
    slug: roadmap.slug,
    title: roadmap.title,
    subtitle: roadmap.subtitle,
    description: roadmap.description,
    domain: roadmap.domain_title || roadmap.domain || "General",
    isFeatured: roadmap.is_featured,
    level: roadmap.level,
    duration: weeksToDuration(roadmap.estimated_duration_weeks),
    stepsCount: roadmap.tracks_count || roadmap.steps_count,
    skills: roadmap.skills,
    tools: roadmap.tools,
    outcome: roadmap.outcomes[0] || "Build a clear portfolio-ready skill path.",
    recommendedProgram: "LearnerSlate Program",
    salaryRange:
      typeof roadmap.payload.salaryRange === "string"
        ? roadmap.payload.salaryRange
        : "Role dependent",
  };
}

export function mapRoadmapDetailToUi(
  roadmap: RoadmapDetail,
): PublicRoadmapDetailData {
  const mapStep = (step: RoadmapDetail["steps"][number], prefix?: string) => ({
    title: prefix ? `${prefix}: ${step.title}` : step.title,
    description: step.description,
    duration: step.duration_label || "Flexible",
    skills: step.skills,
    resources: asStringList(step.resources),
    projects: asStringList(step.projects),
  });

  const stepsFromTracks = roadmap.tracks.flatMap((track) =>
    track.steps.map((step) => ({
      ...mapStep(step, track.title),
      skills: step.skills.length ? step.skills : track.skills,
    })),
  );

  const directSteps = roadmap.steps
    .filter((step) => !step.track)
    .map((step) => mapStep(step));

  const tracks = roadmap.tracks.map((track) => ({
    title: track.title,
    slug: track.slug,
    description: track.description,
    focusArea: track.focus_area,
    skills: track.skills,
    tools: track.tools,
    steps: track.steps.map((step) => ({
      ...mapStep(step),
      skills: step.skills.length ? step.skills : track.skills,
    })),
  }));

  const projects = [...stepsFromTracks, ...directSteps].flatMap(
    (step) => step.projects ?? [],
  );

  return {
    ...mapRoadmapListItemToCard(roadmap),
    overview: roadmap.description,
    steps: stepsFromTracks.length ? stepsFromTracks : directSteps,
    tracks,
    projects,
    responsibilities: asStringList(
      Array.isArray(roadmap.payload.responsibilities)
        ? (roadmap.payload.responsibilities as unknown[])
        : undefined,
    ),
    courses: roadmap.recommended_courses.map((course) => ({
      title: course.title,
      slug: course.slug,
      instructor: "LearnerSlate Mentor",
      duration: "Self-paced",
      level: roadmap.level,
    })),
    relatedCareerPaths: roadmap.related_career_paths.map((careerPath) => ({
      title: careerPath.title,
      slug: careerPath.slug,
      roleFamily: careerPath.role_family || "Software",
      salary:
        careerPath.average_salary_lpa ?
          `${careerPath.average_salary_lpa} LPA`
        : "Market linked",
      demand: careerPath.demand_label,
      skills: careerPath.skills,
    })),
    faqs: Array.isArray(roadmap.payload.faqs)
      ? (roadmap.payload.faqs as { question: string; answer: string }[])
      : [],
  };
}

export const roadmapDetails: PublicRoadmapDetailData[] = [
  {
    slug: "full-stack-engineer",
    title: "Full Stack Engineer",
    subtitle: "Frontend, backend, APIs, databases, and deployment.",
    description:
      "A practical roadmap for building production-grade web apps from interface to infrastructure.",
    domain: "Full Stack",
    level: "Beginner to Intermediate",
    duration: "24 weeks",
    stepsCount: 6,
    skills: ["HTML", "CSS", "React", "Node.js", "PostgreSQL", "AWS"],
    tools: ["GitHub", "Docker", "Postman", "Vercel"],
    outcome: "Build and deploy 4 portfolio-grade products.",
    recommendedProgram: "Industry-Ready Software Engineer",
    salaryRange: "8L - 18L",
    overview:
      "This path takes a learner from web fundamentals to shipping full-stack applications with authentication, APIs, databases, testing, and cloud deployment.",
    steps: [
      {
        title: "Web Foundations",
        description:
          "Build strong fundamentals in semantic HTML, CSS layouts, JavaScript, Git, and browser debugging.",
        duration: "3 weeks",
        skills: ["HTML", "CSS", "JavaScript", "Git"],
        resources: ["Portfolio landing page", "Responsive layout lab"],
      },
      {
        title: "React Application Development",
        description:
          "Learn components, state, forms, routing, data fetching, and reusable UI patterns.",
        duration: "5 weeks",
        skills: ["React", "TypeScript", "Forms", "Routing"],
        resources: ["Dashboard project", "Component system practice"],
      },
      {
        title: "Backend APIs",
        description:
          "Design REST APIs, authentication, validation, error handling, and service-layer logic.",
        duration: "5 weeks",
        skills: ["Node.js", "Express", "Auth", "REST"],
        resources: ["Auth API", "API testing collection"],
      },
      {
        title: "Database and Data Modeling",
        description:
          "Model relational data, write queries, handle migrations, and design clean data contracts.",
        duration: "4 weeks",
        skills: ["PostgreSQL", "Schema Design", "Indexes"],
        resources: ["Data modeling workbook", "SQL challenge set"],
      },
      {
        title: "Production Readiness",
        description:
          "Add testing, logging, deployment, environment configuration, and performance basics.",
        duration: "4 weeks",
        skills: ["Testing", "Docker", "CI", "Deployment"],
        resources: ["Deployment checklist", "Bug bash review"],
      },
      {
        title: "Capstone Product",
        description:
          "Ship a complete product with real user flows, clean documentation, and demo readiness.",
        duration: "3 weeks",
        skills: ["Architecture", "Product Thinking", "Presentation"],
        resources: ["Capstone review", "Mock interview"],
      },
    ],
    faqs: [
      {
        question: "Can beginners start this roadmap?",
        answer:
          "Yes. It starts from web foundations and gradually moves into full-stack systems.",
      },
      {
        question: "Is this connected to a program?",
        answer:
          "Yes. It maps well to the Industry-Ready Software Engineer program.",
      },
    ],
  },
  {
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer",
    subtitle: "Python, ML foundations, model building, and applied AI.",
    description:
      "A focused path for learners who want to build ML models and AI-powered applications.",
    domain: "AI",
    level: "Intermediate",
    duration: "20 weeks",
    stepsCount: 5,
    skills: ["Python", "Pandas", "ML", "Deep Learning", "LLMs"],
    tools: ["Jupyter", "Hugging Face", "TensorFlow", "FastAPI"],
    outcome: "Build applied AI projects with deployable model APIs.",
    recommendedProgram: "Fast-Track Tech Career Program",
    salaryRange: "12L - 28L",
    overview:
      "This roadmap develops strong Python foundations, applied machine learning instincts, and practical deployment skills for AI products.",
    steps: [
      {
        title: "Python for Data Work",
        description:
          "Master Python, notebooks, data structures, files, APIs, and numerical workflows.",
        duration: "4 weeks",
        skills: ["Python", "NumPy", "Pandas"],
        resources: ["Data cleaning lab", "Notebook assignments"],
      },
      {
        title: "Machine Learning Foundations",
        description:
          "Understand supervised learning, evaluation metrics, feature engineering, and model selection.",
        duration: "5 weeks",
        skills: ["Regression", "Classification", "Metrics"],
        resources: ["ML model comparison", "Kaggle-style practice"],
      },
      {
        title: "Deep Learning and NLP",
        description:
          "Build neural network intuition and apply models to text, vision, and embeddings.",
        duration: "5 weeks",
        skills: ["Neural Networks", "NLP", "Embeddings"],
        resources: ["Text classifier", "Embedding search demo"],
      },
      {
        title: "LLM Application Development",
        description:
          "Create AI assistants, retrieval flows, prompt chains, and evaluation loops.",
        duration: "4 weeks",
        skills: ["LLMs", "RAG", "Evaluation"],
        resources: ["RAG app", "Prompt testing checklist"],
      },
      {
        title: "Model APIs and Portfolio",
        description:
          "Wrap models behind APIs, document decisions, and present a complete AI portfolio.",
        duration: "2 weeks",
        skills: ["FastAPI", "Deployment", "Documentation"],
        resources: ["Model API", "Portfolio review"],
      },
    ],
    faqs: [
      {
        question: "Do I need advanced math first?",
        answer:
          "You need comfort with basic algebra and probability; the path builds applied intuition as you go.",
      },
      {
        question: "Will this include LLM projects?",
        answer:
          "Yes. The later stages focus on LLM apps, retrieval, and deployable AI workflows.",
      },
    ],
  },
  {
    slug: "devops-cloud-engineer",
    title: "DevOps and Cloud Engineer",
    subtitle: "Linux, CI/CD, containers, infrastructure, and monitoring.",
    description:
      "A systems-heavy route for learners who want to run, scale, and observe production apps.",
    domain: "DevOps",
    level: "Intermediate",
    duration: "18 weeks",
    stepsCount: 5,
    skills: ["Linux", "Docker", "CI/CD", "AWS", "Monitoring"],
    tools: ["GitHub Actions", "Terraform", "CloudWatch", "Nginx"],
    outcome: "Deploy and operate resilient cloud applications.",
    recommendedProgram: "Cloud and Systems Track",
    salaryRange: "10L - 22L",
    overview:
      "This roadmap turns application developers into production-minded engineers who can deploy, automate, monitor, and debug cloud systems.",
    steps: [
      {
        title: "Linux and Networking Basics",
        description:
          "Learn shell workflows, permissions, processes, HTTP, DNS, and common production debugging.",
        duration: "3 weeks",
        skills: ["Linux", "Shell", "Networking"],
        resources: ["Server debugging lab", "HTTP basics workbook"],
      },
      {
        title: "Containers",
        description:
          "Package apps with Docker, compose services locally, and understand runtime concerns.",
        duration: "4 weeks",
        skills: ["Docker", "Compose", "Images"],
        resources: ["Containerize an app", "Dockerfile review"],
      },
      {
        title: "CI/CD",
        description:
          "Automate linting, tests, builds, image publishing, and deployment gates.",
        duration: "4 weeks",
        skills: ["GitHub Actions", "Pipelines", "Secrets"],
        resources: ["CI workflow", "Release checklist"],
      },
      {
        title: "Cloud Deployment",
        description:
          "Deploy services to cloud infrastructure with managed databases, load balancing, and object storage.",
        duration: "5 weeks",
        skills: ["AWS", "RDS", "S3", "Load Balancing"],
        resources: ["Cloud deployment lab", "Cost review"],
      },
      {
        title: "Monitoring and Reliability",
        description:
          "Add logs, metrics, alerts, runbooks, and incident response basics.",
        duration: "2 weeks",
        skills: ["Logs", "Metrics", "Alerts"],
        resources: ["Observability dashboard", "Incident simulation"],
      },
    ],
    faqs: [
      {
        question: "Is this only for backend developers?",
        answer:
          "No. Frontend, backend, and system-curious learners can all use this path.",
      },
      {
        question: "Will this help AWS deployment?",
        answer:
          "Yes. The roadmap includes cloud deployment and production readiness practices.",
      },
    ],
  },
];

export const roadmapCards = roadmapDetails.map((roadmap) => ({
  slug: roadmap.slug,
  title: roadmap.title,
  subtitle: roadmap.subtitle,
  description: roadmap.description,
  domain: roadmap.domain,
  level: roadmap.level,
  duration: roadmap.duration,
  stepsCount: roadmap.stepsCount,
  skills: roadmap.skills,
  tools: roadmap.tools,
  outcome: roadmap.outcome,
  recommendedProgram: roadmap.recommendedProgram,
  salaryRange: roadmap.salaryRange,
}));
