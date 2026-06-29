import { Inline, Container } from "@/components/shared/primitives";

export function HeaderBanner() {
  return (
    <div className="hidden lg:block bg-slate-900 text-white text-sm">
      <Container>
        <Inline justify="between" align="center" className="py-2">
          <Inline justify="start" gap={24}>
            <span>Students</span>
            <span>Become Partner</span>
            <span>Become Instructor</span>
          </Inline>

          <span>English</span>
        </Inline>
      </Container>
    </div>
  );
}
