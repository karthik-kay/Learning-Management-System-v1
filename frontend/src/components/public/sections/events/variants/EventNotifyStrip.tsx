import { Grid, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EventNotifyStrip() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1E293B] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] lg:p-8">
      <Grid className="grid-cols-1 gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <Stack gap={8}>
          <h2 className="text-3xl font-bold tracking-tight">
            Never Miss an Event
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[#E9EAF0]">
            Get notified for upcoming webinars, workshops, hackathons, exams,
            and bounties.
          </p>
        </Stack>

        <form className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-11 border-white/10 bg-white/10 text-white placeholder:text-[#8C94A3]"
          />
          <Button className="h-11 bg-[#FF7A0E] text-white hover:bg-[#E86C0D]">
            Notify Me
          </Button>
        </form>
      </Grid>
    </div>
  );
}
