import { Footer, Navbar } from "@/components/public/nav";
import { MobileDrawer } from "@/components/public/nav/MobileDrawer";
import {
  AuthNavigation,
  Logo,
  MainNavigation,
} from "@/components/public/nav/widgets";
import { Inline, Stack } from "@/components/shared/primitives";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header>
        <Navbar
          className="bg-white"
          media={<Logo />}
          links={<MainNavigation />}
          mobileDrawer={
            <MobileDrawer
              links={<MainNavigation mobile />}
              actions={<AuthNavigation mobile />}
            />
          }
          actions={<AuthNavigation />}
        />
      </header>

      <main className="flex-1">{children}</main>

      <footer>
        <Footer
          brand={
            <Stack gap={16}>
              <Logo />
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Learn real-world skills through structured programs, mentorship,
                projects, and career support.
              </p>
            </Stack>
          }
          navigation={
            <Inline gap={48} align="start" wrap className="gap-y-8">
              <Stack gap={10}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Programs
                </p>
                <Stack gap={8}>
                  <Link
                    href="/programs"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Software Engineering
                  </Link>
                  <Link
                    href="/programs"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Fast Track Career
                  </Link>
                  <Link
                    href="/roadmaps"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Learning Roadmaps
                  </Link>
                </Stack>
              </Stack>

              <Stack gap={10}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Company
                </p>
                <Stack gap={8}>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/career-path"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Career Paths
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </Stack>
              </Stack>

              <Stack gap={10}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Resources
                </p>
                <Stack gap={8}>
                  <Link
                    href="/faq"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/success-stories"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Success Stories
                  </Link>
                </Stack>
              </Stack>
            </Inline>
          }
          social={
            <Stack gap={10}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Follow Us
              </p>
              <Stack gap={8}>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  LinkedIn
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Instagram
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  YouTube
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Discord
                </Link>
              </Stack>
            </Stack>
          }
          copyright={
            <Inline justify="between" wrap className="w-full gap-y-3">
              <p className="text-xs text-muted-foreground">
                © 2026 Vaarada PVT LTD. All rights reserved.
              </p>
              <Inline gap={20}>
                <Link
                  href="/refund-policy"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Refund Policy
                </Link>
                <Link
                  href="/privacy"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </Inline>
            </Inline>
          }
        />
      </footer>
    </div>
  );
}
