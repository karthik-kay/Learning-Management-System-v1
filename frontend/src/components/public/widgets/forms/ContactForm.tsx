import { BaseForm, FormField, FormActions } from "./blocks";

import { Grid, Stack } from "@/components/shared/primitives";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactForm() {
  return (
    <BaseForm
      eyebrow="Get in touch"
      title="Send us a message"
      description="Our AI reads every message and ensures it lands with the right person. No generic inboxes."
    >
      <Stack gap={24}>
        <Grid className="grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="First Name">
            <Input placeholder="Alex" />
          </FormField>

          <FormField label="Last Name">
            <Input placeholder="Morgan" />
          </FormField>
        </Grid>

        <FormField label="Email Address">
          <Input type="email" placeholder="alex@company.com" />
        </FormField>

        <FormField label="I am a...">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="student">Student / Learner</SelectItem>
              <SelectItem value="mentor">Mentor / Educator</SelectItem>
              <SelectItem value="corporate">Corporate / Partner</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Message">
          <Textarea rows={5} placeholder="Tell us about your inquiry..." />
        </FormField>

        <FormActions>
          <Button type="submit" size="lg" className="w-full gap-2">
            Send Message
            <ArrowRight className="h-4 w-4" />
          </Button>
        </FormActions>
      </Stack>
    </BaseForm>
  );
}
