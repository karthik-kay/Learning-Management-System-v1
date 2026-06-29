/**
 * ProgramsPage.tsx
 * Converted from HTML to TSX using layout primitives:
 * Box, Stack, Inline, Grid, Spacer, Divider
 *
 * Assumptions:
 * - Tailwind CSS is configured with the same custom tokens as the original
 * - Material Symbols Outlined font is loaded globally
 * - Geist + Inter fonts are loaded globally
 * - Images are served from /assets or a CDN (src props kept as-is from original)
 * - primitives are imported from "@/components/primitives"
 */

import {
  Box,
  Stack,
  Inline,
  Grid,
  Spacer,
  Divider,
} from "@/components/shared/primitives";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Program {
  id: string;
  title: string;
  description: string;
  badge?: { icon: string; label: string };
  icon: string;
  weeks: number;
  level: string;
  projects: number;
  enrolled: number;
  capacity: number;
  techs: { src: string; alt: string }[];
  imageSrc: string;
  imageAlt: string;
}

interface ComparisonRow {
  feature: string;
  standard: string;
  pro: string;
  executive: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROGRAMS: Program[] = [
  {
    id: "fullstack",
    title: "Full Stack Development",
    description: "Master React, Node.js, and Cloud deployment from scratch.",
    badge: { icon: "verified", label: "Verified" },
    icon: "code",
    weeks: 24,
    level: "Intermediate",
    projects: 12,
    enrolled: 25,
    capacity: 30,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsIpEFU9mjUZyYDXv_9i7xN1QNIvmsYfGnftK-G3awR5PE3-iRwGQnaPMwSwYcNWJtLd4q1IzqNEDtWpUd2i8wqZGXXr1MYKU5XnYJMo88v4G3Y-JXlXtd1c8DydWjb4iUWk1BRxb7YrQtAO2_fBKJKCzA5fuHf2gABw-iIHMXqKefcgnwWZ8cMoToRwIKVNAwAhcFmefJfynWOGTPdsAMUIbMvcjXlCBC5mF04Aj0c0_bvrQHfNufvv26ToM0wPotRMUH0_1Wojw",
    imageAlt: "Full Stack Dev workspace",
    techs: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzM5Eh-BJqS7cB6kmL55cCc3HBLMlC_akci5lweBwp4Q7gbuTfU7g2BWt-T36oW65ND9_Yw6rgSDRFC6dBB456EXwCoCUQKnB8rksOubxd4FRRqjIkNbte8QtxTWGsJi5UvclqU-Eb8OD6eoCuOSE1J-h9VENhzTRLQMLG4unELvR7vCjgF2YcaMH2Ey7weAJPGmCmPSa79ZHL7DXJpMM4AvGtY6x-XNncEn0jRD_ngzQ0BeSvEBJJTMPHLNt2wpISZsGs-ew4ga0",
        alt: "React",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW3Q4hXMAyMiNPrxWbNhqIc79FTvdb2iRlY3c467Dd9-pDFuL28WXGw4v4PP-61nHyLR4LCB4jaPv4n1qhDk9fWmgl5Y2lXx1gT5pOaI2_XxCo3zEqp_jPLID9lI4Cl7RYniBPxr7l-MXePqmmEWVDwX6-ONxtF2DjONddT1wT1hCQCDklbriiKVXLMpzpRRKO5QQGyMNG9RsFJwSGpQpS6nhJIl8hVMN0ZA14IMfhkzUx8tK-TjxT224_iCTSpiV3HJsFyUUINVA",
        alt: "Node",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUI-PEwp-ltNawUfKVOjNspBs3MHgOrygS0hd5ZbwHZD9vAYm0puUj2XSHgScaS_LxHbG1oCXfIDaoOhwlQ0cXD63EgYYADOpJNhGWpFhjT8PKXk-E4pBgXGac6ApX64PuhnvWCbL7TkkZiOgUulxpwKuaAraBhgsILiKcZu7q28OLEtZhc8YiZbnSF-Hr6PdjpL4XVumCYh__fHyTh-ApAD5pWhD-kVHLLo1yLfkN0TO1GeiuTrfz80fGp_Q8P-SIwLF3WJQFafw",
        alt: "TypeScript",
      },
    ],
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    description: "Build LLMs, Generative AI models, and neural networks.",
    badge: { icon: "trending_up", label: "Hot Now" },
    icon: "psychology",
    weeks: 16,
    level: "Advanced",
    projects: 8,
    enrolled: 12,
    capacity: 20,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCydikMcf05yFwcHgsd8zyorps6m8HZsJq465YDm9M2Gqh4yqHVW7CnRy9lUZnbi3p0pHxKyOcmiE-XqJFWS7SDWY9uMguvoJVy4FkNlDDQq8buxS0RLvOO8yHDPqQQCRKCoP53mshu24dN384hbauFXGeHtTLZDMOkAzmyxF6DE2A-D705nuQ7oEysQGwaIHrkQdNmggfLtPluDMeLKvbrUbIcO13nugnG_gboCS53pT-V17us-UcCjRxMFgQXG2GMrvr0TKpyozI",
    imageAlt: "Neural network visualization",
    techs: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNj-tFFu9Ek2xpdTRI-cIFedwkb2C2HzpOmr5QJXAe6XkVnRbQ76QXisE8I8hnE8lD12TA-Fgqdd8GHWqpIzysIhd2Wze4WwJKi5p4atI-pImVyxVyUnDrqtJTsZmmGE-7zziR5yJ9sRYoNkYBlpMCwe3AY8rYVznoZoqv723SyJbGKHlFzXXtV9CZAtC2icISrA4C9tjLA3V3LKI5jzdWSmVduad-Px6aNMzz5Kbxuc6_AuF-Pm_cJuVtUUirLL-O89dnDrbL5mw",
        alt: "Python",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfyRUuqL7HMrro8ok-sozHa4HEM99fGvmgl3SZwCNFDKDFNWJ0oonagQ1ZA3DoGmcWfKqBAYNIwo4-WdtoOjDAqULwhX0X_HSkWXzt9yQ7COoxIMyp4xwodsuKqdJ_FTSSA7Ln5ZKvX2HLkUpPv97FP8TXDouoxyhXuD26RhfnBl2ozAWYrZ0uXIOm0PjIPLxE1ksIIxkA4ahPXa-X6RZbgjPtuCbftQbxAGz6rn_zrklOK-6r1Qu8qdc7prcXJZmKYIEMbzb9PPU",
        alt: "PyTorch",
      },
    ],
  },
  {
    id: "datascience",
    title: "Data Science",
    description: "From raw data to actionable insights with Python & SQL.",
    icon: "database",
    weeks: 20,
    level: "Intermediate",
    projects: 10,
    enrolled: 18,
    capacity: 30,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvnXXDUgldRoYl8sK5DNVlZHS70VPi0JvJPJY2M4A2S2dS-iDXpRMMImD1dztDbG7EcW_V4KnPK2zoPASvZOcsEeP-shxKqaEl5evZz71g0X6Ni2AxgeAi8Urb4jmPbWD-h9p3d7NoVzRKjDKwnnvT4i7AS2lVmiTJSJDBQBiCAX85rxI-BcZLf2hX2uD42RSFSkrxghY3Xnk9jhGNRu3UAP7M5h8gUaTHC5vgkoqDw9D6-Do-5n5JwZiJQj3Jv2ybYL2tGEwwGoM",
    imageAlt: "Data science workspace",
    techs: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCON8_qIAO1yb0MfIYvfN2TatkylE4OWzvfvzZZLnVXEEOectPBttQ-BIoka5sNUnjALZi0Yk5h3RkGySWczHLRcblPeY_7ltnNaWvKp6_T7qxSpeDqVPXuyyJsURAsGEECOUuaSxRsvMg-9qdGxEac4y8GKm5ILWHu9JLKwQjl3iCXTDx0KeIQFmg8J9bM22yqvxC7LX7GVBMxOJWB7DMCXDGYdHo1APIwG6JCgY4wj7fLn0EMSr1fptLvDRffLmWMN7ktndAGMUg",
        alt: "Pandas",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuArJnfNFFWx99bgw32kFTM2XbseAAY_iGV9SG0Egwq5lgFkvvQBSv0z2_75Px49aWFTHi9xMoeSw3YEmhBrjD2kZfdeehNwVzRhfwqreDAPP2cjRBt3spwJesJo_RuiCVLYRDGlw4WI-46E9ziH10KtjMVe_a4RHgj5kAMaYcKiSBZx2lUugsw5c64IcNnCsdakQIXCmkbo9WSV2Sd5a5aQRRuRn-1vE8nbQpxAI7AliHcBH_SockY8lfZPsCrcRfBP7AuNUM8Fp_s",
        alt: "Jupyter",
      },
    ],
  },
  {
    id: "cybersec",
    title: "Cyber Security",
    description: "Ethical hacking, network security, and threat intelligence.",
    icon: "security",
    weeks: 12,
    level: "Intermediate",
    projects: 6,
    enrolled: 10,
    capacity: 15,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC16_jemYgvWDx__uB1bZwUiw_RfJfsedtINIgoE_fgwSqCaWNgwnUbMDLej8gRRd9JUndyimwETukzmalM7yf1OTp4BSGP1UmF3FyJoOAyCOr7b0y06a9k-1sWbATX1cTblvPOvasG5_LETUAtQYCNAx90ls0uqDcfNkuFXv0hP_kmzQlHDh3DdN1CbuQdu9tey6XcVz7S5bbd9123wp61nMr2AFy_Av3YlhtSO3iWTjNZ8q3jYyxiQhnB2J3mMvjTHH1qSgS__Ro",
    imageAlt: "Cybersecurity visualization",
    techs: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4WsXY3kcDGoM-2n7n4q5rFfINw7phmKDbpXMKSAWWCh9DrL-RDfFrHbayaE7kldDinLXk1nB3nywS4uCPZqs3oTGSwW42MBHj9u-8fOSRfHjNAHwVcx_BwnGjZjbnE6BK9_VZ2r13mDdCK_agf7MqIanmW0GhUGqgOlNN_DR30KXMYIgKBzXlAR-sJvrr4MbAbuNdnHLokS6Ar_UO2sEodiBYaqT_U_dS_PbfVYQXwKWH29GlDxitqbPx5n5X6WUQdSRS1MGpZtg",
        alt: "Linux",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvrHJrBOVa76bHRwouAvOX2kcTc0vP9gay6WhPdW2aY3IHToIQ4WsFDx5iyNUAtWhDrJR3OW6Uacd-LjZEtlYyWgHNWDQ6VQhsxRKnXsejNKWfADZrab2hvgp4YUJM733GAsYQr8_8gMgUP4XGHAVZ4GLS15a_FMzUpbWCqUjO2PJiVZ0qj6swLNXVHsuoo6EylWJa8u-H2A9M9Pf_tyeTE7E86W6DoCoc0aV-Lc5xblK6oRqLzKsRWLGR0xKfndVpCWIUiCrBwh8",
        alt: "Docker",
      },
    ],
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    description:
      "Master design systems, user research, and high-fidelity prototyping.",
    icon: "palette",
    weeks: 12,
    level: "Beginner",
    projects: 5,
    enrolled: 22,
    capacity: 25,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWucT-cc4ZxQ4LbStjtLaLV9vkUyrX5n1CuSOvIiBSNlXFJAVfCJz4DI6om8qTehA2kJvOVtiyyDDtzKkoBrORCIEIwctOg2buWIzitec5e_36WmspFM9-JqlwjqK8JFqOCSZWYXedPOhSHgsiyY1HfBXJC8D5_w_lPwpW0vAiBI1j6-8O7s-CuSZEC5xvhAD_ub_vuzUkcij7xc8DHoHriQEPLZJudiRI1kjrYD-dqDmgmXNvV2ZQ7RRtOM6oMvQf5fmVtvAZ9zE",
    imageAlt: "UI/UX design studio",
    techs: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuATFJz84m0fuVbU-LcpeKTsv0GjRNfj-Vpyn83kjz8HZXN-IaiulvHjcR9f1GDGZN--25BQcTKeP7cF9DKK5J92op1eenk3Dge4t0gDLCetLeL4vdJW-dPCkkNwZqN8XdQzoO9M7IN7ZTBgbdzy9fgokAFiR6dsloPCV2b4UBCd9rKY0iHRqXE0hbw_jHx5TtVIyaW_ClnBjFXxjcHMBnXQQkYsjSIBnUdfDBqq3v2z4VRprsJZqRYTcSF24aeIsLsFpOOpmeQzc5A",
        alt: "Figma",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9ZUqU8HBokr0qcBdtnhgf5Cx4KwWGREPLrbIoLggoasNPxyJrDGQxH3fZVi7jERkWzsrMl0UsxgvZDH_iTQpUu8O8yPsmiYW8A3QJPmmauxSrttS_G_K_-fOUJpyFa6CJ9B_unv9-5g0WZ4--tKvtoZfLsy8l_BMBwLyxa5-KaBsnXeZ98Ze_zbMmURsftGB1P56VCn7xpSZQN8bThlTulRm4vc7PV45pcnTQvbaaAGzMpZ2Uhs74spguCc9i73EP1eubeuzXwc8",
        alt: "Photoshop",
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud Engineering",
    description: "Architect scalable infrastructure using AWS, Azure, and GCP.",
    icon: "cloud",
    weeks: 18,
    level: "Intermediate",
    projects: 7,
    enrolled: 15,
    capacity: 20,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwO4yN7q73FMCALqO-ej0UFKnE_CAYodqisqvqncSosvGLY1fep-iclq6x4ZwQxZAFxShB1B-h8vUs9bRZehEJV-YRNnJvarwx_H33mHKc0NYpeRixHdMberynTKPETispYR-50wZSMsVct2CLdG7Qrlhe9SCSZVreM6NS65oov7XV9q2CTEDQjauX6C5GADIvX98p7tyXQJAtpFgePAa1rLA3q6cZ4yzYaMZLuczm4X1RxGvxn4IqezhKMdzRTURBPlSmi5Nedlc",
    imageAlt: "Cloud data center",
    techs: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJguLt1eeQKgKy3u5VImsSbMBqHZguqlilsSTqwoV1FJizzITbH3j5Y82TL7-MLyKy0UvwCc2jJdJeAqmDjEoHtmOnl5iKV4BTr4Rfv4CTRwBchE83t3Zy73bLILzIMDtAxM0NzI7se5pnN0TTmxyMoLivgCnlgeP8Hadi0NZeG2lOTNiiJtR72DxTGC9pjLyhUkn83RRbUSrlr7iYYeeKsGEvG7gWAWa8fzkUa5AwE9P2FNY4Toi7At9h07famonoeogaQMfA3LE",
        alt: "AWS",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvfPmZ63kVHEJWT0lqGqin7cMwXfYvBNedbEvO8DDsLql82_uIodPje-H5zr9QS6G1OF8mV8h7aUsPHwcP_hB3d1yrziTw-CLQ6HtQkJsI9y1Wj5a4YMl5F1tz4QT4ZSxD3VOzIIjp9iN9dnxNKysl7P9rVqL0tyVZExak6b9s8Uu__tU9ORcqjnY2TFU_nR6bDRA-LXesjaqsdv3CQxv6bATcUU47i3hjJPWtJkYPkA3h0V07SaEvyXBTrFtar1ml_xmSwerdt4s",
        alt: "Kubernetes",
      },
    ],
  },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Duration",
    standard: "3 Months",
    pro: "6 Months",
    executive: "12 Months",
  },
  {
    feature: "Skill Level",
    standard: "Beginner",
    pro: "Intermediate",
    executive: "Advanced",
  },
  {
    feature: "Industry Projects",
    standard: "2 Projects",
    pro: "8 Projects",
    executive: "Unlimited",
  },
  {
    feature: "Live Sessions",
    standard: "—",
    pro: "Weekly",
    executive: "Daily 1-on-1",
  },
  {
    feature: "Certification",
    standard: "✓",
    pro: "✓",
    executive: "✓ Verified",
  },
  {
    feature: "Career Support",
    standard: "Basic",
    pro: "Advanced + Placement",
    executive: "Personal Concierge",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MatIcon({
  name,
  fill = false,
  size = 24,
  className = "",
}: {
  name: string;
  fill?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0",
      }}
    >
      {name}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-20 border-b border-outline-variant glass-nav bg-surface">
      <Box className="max-w-container-max mx-auto px-margin-desktop h-full">
        <Inline justify="between" align="center" className="h-full">
          {/* Left: logo + nav links */}
          <Inline justify="start" gap={32} align="center">
            <span className="font-headline-md text-headline-md font-bold text-primary">
              EduPremium
            </span>
            <Inline
              justify="start"
              gap={24}
              align="center"
              className="hidden md:flex"
            >
              <a
                href="#"
                className="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md"
              >
                Programs
              </a>
              {["Roadmaps", "Resources", "About"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 font-label-md text-label-md"
                >
                  {label}
                </a>
              ))}
            </Inline>
          </Inline>

          {/* Right: auth CTAs */}
          <Inline justify="end" gap={16} align="center">
            <button className="text-on-surface font-label-md text-label-md hover:text-primary transition-colors">
              Login
            </button>
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:scale-95 transition-transform">
              Get Started
            </button>
          </Inline>
        </Inline>
      </Box>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const trustBadges = [
    "Industry Projects",
    "Certificates",
    "Flexible Learning",
  ];
  const stats = [
    { value: "50+", label: "Programs" },
    { value: "10k+", label: "Students" },
    { value: "95%", label: "Satisfaction" },
  ];

  return (
    <section className="max-w-container-max mx-auto px-margin-desktop py-section-gap">
      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        {/* Left column */}
        <Stack gap={32} className="lg:col-span-7">
          {/* Eyebrow badge */}
          <Inline
            justify="start"
            gap={8}
            align="center"
            className="inline-flex w-fit px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-label-sm font-label-sm"
          >
            <MatIcon name="auto_awesome" size={16} />
            <span>New Advanced AI Tracks Available</span>
          </Inline>

          {/* Headline */}
          <h1 className="font-display-xl text-display-xl tracking-tight leading-tight">
            Choose the Right Program <br />
            <span className="text-primary">for Your Career</span>
          </h1>

          {/* Subheadline */}
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Learn through project-based, industry-focused programs designed by
            experts. Transition into high-growth tech roles with confidence and
            community support.
          </p>

          {/* CTAs */}
          <Inline justify="start" gap={16} align="center">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:scale-[1.02] transition-all flex items-center gap-2">
              Explore Programs
              <MatIcon name="arrow_forward" />
            </button>
            <button className="border border-outline-variant text-on-surface px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors">
              Talk to a Mentor
            </button>
          </Inline>

          {/* Trust badges */}
          <Inline justify="start" gap={24} align="center">
            {trustBadges.map((badge) => (
              <Inline
                key={badge}
                justify="start"
                gap={8}
                align="center"
                className="text-on-surface-variant font-label-md text-label-md"
              >
                <MatIcon name="check_circle" fill className="text-primary" />
                {badge}
              </Inline>
            ))}
          </Inline>

          <Divider />

          {/* Stats row */}
          <Grid columns="repeat(3, 1fr)" gap={32} className="max-w-xl">
            {stats.map((s) => (
              <Stack key={s.label} gap={4} align="start" justify="start">
                <span className="font-headline-lg text-headline-lg text-primary">
                  {s.value}
                </span>
                <span className="text-label-md text-on-surface-variant">
                  {s.label}
                </span>
              </Stack>
            ))}
          </Grid>
        </Stack>

        {/* Right column: visual */}
        <Box className="lg:col-span-5 relative hidden lg:block">
          <Box className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
          <Box className="relative bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl premium-shadow">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqSG6KAvg9p8MLZZ3C-Mxh2rFChA0F_coVPnHrpnJzA8OG5hcW4Cd3_5WoHj5WcyHKi2cB7oZGHwEXEcCwpSQp2jZLa42eQCR4L7-2WqhysSH9SIVmfurZOydhp_qk-z6SzhRYNt5mAL8u0aNAGb6EuPkhnKUrcgddoNcqaCMcP4a0HOH3JerFH2iDV68upM3kHNUeV3PtEDLMh1b7dYsvXUwSocSvt6L9KCpDvoZblM-jRCVI2_4zlOZP0Y1yIOtVfCMfNN-3_r0"
              alt="Learning Platform Dashboard"
              className="rounded-xl w-full"
            />
            {/* Floating badge */}
            <Box
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl premium-shadow border border-outline-variant"
              style={{ animation: "bounce 3s infinite" }}
            >
              <Inline justify="start" gap={12} align="center">
                <Box className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white">
                  <MatIcon name="emoji_events" />
                </Box>
                <Stack gap={2} align="start" justify="start">
                  <span className="text-label-sm font-bold">Badge Earned</span>
                  <span className="text-[10px] text-on-surface-variant">
                    Full Stack Mastery
                  </span>
                </Stack>
              </Inline>
            </Box>
          </Box>
        </Box>
      </Box>
    </section>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonSection() {
  return (
    <section className="bg-surface-container-low py-section-gap">
      <Box className="max-w-container-max mx-auto px-margin-desktop">
        <Stack gap={16} align="center" className="mb-16">
          <h2 className="font-headline-lg text-headline-lg">
            Compare Learning Paths
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Find the program that matches your goals.
          </p>
        </Stack>

        <Box className="overflow-x-auto">
          <Box className="min-w-[800px] bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden premium-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface">
                  <th className="p-6 border-b border-outline-variant font-headline-md text-headline-md w-1/4">
                    Features
                  </th>
                  {[
                    {
                      label: "Standard Track",
                      sub: "Foundation Builder",
                      highlight: false,
                    },
                    {
                      label: "Professional Pro",
                      sub: "Career Focused",
                      highlight: true,
                    },
                    {
                      label: "Executive Master",
                      sub: "Elite Coaching",
                      highlight: false,
                    },
                  ].map(({ label, sub, highlight }) => (
                    <th
                      key={label}
                      className={`p-6 border-b border-outline-variant text-center border-l ${
                        highlight ? "bg-primary-container/5" : ""
                      }`}
                    >
                      <Stack gap={4} align="center" justify="start">
                        <span className="text-primary font-bold">{label}</span>
                        <span className="text-label-sm text-on-surface-variant font-normal">
                          {sub}
                        </span>
                      </Stack>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-on-surface">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className="hover:bg-surface/50">
                    <td
                      className={`p-6 font-medium ${i < COMPARISON_ROWS.length - 1 ? "border-b border-outline-variant" : ""}`}
                    >
                      {row.feature}
                    </td>
                    {[row.standard, row.pro, row.executive].map((cell, j) => (
                      <td
                        key={j}
                        className={`p-6 text-center border-l border-outline-variant ${
                          j === 1 ? "bg-primary-container/5" : ""
                        } ${i < COMPARISON_ROWS.length - 1 ? "border-b border-outline-variant" : ""}`}
                      >
                        {cell === "✓" || cell === "✓ Verified" ? (
                          <MatIcon
                            name={
                              cell === "✓ Verified"
                                ? "verified"
                                : "check_circle"
                            }
                            className="text-primary"
                          />
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </section>
  );
}

// ─── Program Card ─────────────────────────────────────────────────────────────

function ProgramCard({ program }: { program: Program }) {
  return (
    <Box className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden premium-shadow card-hover transition-all duration-300">
      {/* Thumbnail */}
      <Box className="h-48 overflow-hidden relative">
        <img
          src={program.imageSrc}
          alt={program.imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {program.badge && (
          <Inline
            justify="start"
            gap={4}
            align="center"
            className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-label-sm"
          >
            <MatIcon
              name={program.badge.icon}
              size={16}
              className="text-primary"
            />
            {program.badge.label}
          </Inline>
        )}
      </Box>

      {/* Body */}
      <Stack gap={16} className="p-6">
        {/* Title row */}
        <Inline justify="between" align="start">
          <h3 className="font-headline-md text-headline-md">{program.title}</h3>
          <Box className="bg-primary-container text-white p-1 rounded">
            <MatIcon name={program.icon} size={16} />
          </Box>
        </Inline>

        {/* Description */}
        <p className="text-on-surface-variant font-body-md">
          {program.description}
        </p>

        {/* Meta grid */}
        <Grid
          columns="repeat(2, 1fr)"
          gap={16}
          className="text-label-sm border-y border-outline-variant py-3"
        >
          {[
            { icon: "schedule", text: `${program.weeks} Weeks` },
            { icon: "bar_chart", text: program.level },
            { icon: "assignment", text: `${program.projects} Projects` },
            {
              icon: "group",
              text: `${program.enrolled}/${program.capacity} Enrolled`,
            },
          ].map(({ icon, text }) => (
            <Inline key={text} justify="start" gap={8} align="center">
              <MatIcon name={icon} size={20} className="text-primary" />
              {text}
            </Inline>
          ))}
        </Grid>

        {/* Footer: tech stack + CTA */}
        <Inline justify="between" align="center">
          <Inline justify="start" gap={8} align="center">
            {program.techs.map((t) => (
              <Box
                key={t.alt}
                className="p-1.5 bg-surface-container rounded-lg"
              >
                <img src={t.src} alt={t.alt} className="w-5 h-5" />
              </Box>
            ))}
          </Inline>
          <button className="text-primary font-bold hover:underline flex items-center gap-1">
            View Track <MatIcon name="chevron_right" />
          </button>
        </Inline>
      </Stack>
    </Box>
  );
}

// ─── Programs Grid Section ────────────────────────────────────────────────────

function ProgramsGridSection() {
  return (
    <section className="max-w-container-max mx-auto px-margin-desktop py-section-gap">
      {/* Section header */}
      <Inline justify="between" align="end" className="mb-12 flex-wrap gap-6">
        <Stack gap={16} align="start" justify="start">
          <h2 className="font-headline-lg text-headline-lg">
            Our Core Programs
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Intensive tracks designed to take you from beginner to job-ready in
            24 weeks or less.
          </p>
        </Stack>

        {/* Filter pills */}
        <Inline
          justify="start"
          gap={0}
          align="center"
          className="bg-surface-container border border-outline-variant rounded-full p-1"
        >
          {["All", "Development", "Data & AI"].map((label, i) => (
            <button
              key={label}
              className={`px-6 py-2 rounded-full font-label-md ${
                i === 0
                  ? "bg-white shadow-sm text-on-surface"
                  : "text-on-surface-variant"
              }`}
            >
              {label}
            </button>
          ))}
        </Inline>
      </Inline>

      {/* Card grid */}
      <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap={32}>
        {PROGRAMS.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
      </Grid>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

function BottomCTASection() {
  return (
    <section className="max-w-container-max mx-auto px-margin-desktop py-section-gap">
      <Box className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-container to-primary p-12 text-center text-on-primary-container premium-shadow">
        {/* Background blobs */}
        <Box className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <Box className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <Stack
          gap={24}
          align="center"
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="font-headline-lg text-headline-lg">
            Not Sure Which Program Is Right For You?
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary-container/90">
            Our career advisors are ready to help you map out your journey.
            Speak with our mentors to find your path today.
          </p>
          <Inline justify="center" gap={16} className="flex-wrap">
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:scale-[1.02] transition-transform">
              Book Free Consultation
            </button>
            <button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-white/20 transition-colors">
              Browse All Programs
            </button>
          </Inline>
        </Stack>
      </Box>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const eduLinks = ["Programs", "Roadmaps", "Certifications", "Scholarships"];
  const suppLinks = [
    "Resources",
    "Mentor Support",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
    <footer className="w-full px-margin-desktop py-section-gap border-t border-outline-variant bg-surface-container-lowest">
      <Box className="max-w-container-max mx-auto">
        <Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap={24}>
          {/* Brand column */}
          <Stack gap={24} align="start" justify="start">
            <span className="font-headline-md text-headline-md font-bold text-primary">
              EduPremium
            </span>
            <p className="text-on-surface-variant font-body-md">
              High-fidelity learning for professionals who want to build the
              future of technology.
            </p>
            <Inline justify="start" gap={16} align="center">
              {["public", "groups"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <MatIcon name={icon} />
                </a>
              ))}
            </Inline>
          </Stack>

          {/* Education links */}
          <Stack gap={24} align="start" justify="start">
            <h4 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface">
              Education
            </h4>
            <Stack gap={16} align="start" justify="start">
              {eduLinks.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                >
                  {l}
                </a>
              ))}
            </Stack>
          </Stack>

          {/* Support links */}
          <Stack gap={24} align="start" justify="start">
            <h4 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface">
              Support
            </h4>
            <Stack gap={16} align="start" justify="start">
              {suppLinks.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
                >
                  {l}
                </a>
              ))}
            </Stack>
          </Stack>

          {/* Newsletter */}
          <Stack gap={24} align="start" justify="start">
            <h4 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface">
              Newsletter
            </h4>
            <p className="text-on-surface-variant font-body-md">
              Stay updated with the latest in tech education.
            </p>
            <Stack gap={12} align="stretch" justify="start" className="w-full">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button className="w-full bg-primary text-on-primary font-label-md py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </Stack>
          </Stack>
        </Grid>

        <Spacer size={48} />
        <Divider />
        <Spacer size={32} />

        <Box className="text-center">
          <p className="text-label-sm text-on-surface-variant">
            © 2024 EduPremium. High-fidelity learning for professionals.
          </p>
        </Box>
      </Box>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgramsPage() {
  return (
    <Box className="bg-background text-on-surface overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <ComparisonSection />
        <ProgramsGridSection />
        <BottomCTASection />
      </main>
      <Footer />
    </Box>
  );
}
