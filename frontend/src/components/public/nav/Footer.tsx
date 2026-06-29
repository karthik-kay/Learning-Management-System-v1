import { ReactNode } from "react";

import {
  Stack,
  Inline,
  Box,
  Grid,
  Container,
  Divider,
} from "@/components/shared/primitives";

interface FooterProps {
  brand?: ReactNode;
  navigation?: ReactNode;
  social?: ReactNode;
  copyright?: ReactNode;
}

export function Footer({ brand, navigation, social, copyright }: FooterProps) {
  return (
    <footer className="w-full ">
      <Container size="xl">
        <Stack className="py-10 gap-8 md:gap-12">
          {/* Main row — stacks on mobile, goes side-by-side on lg */}
          <Grid className="grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand — takes up more visual weight */}
            <Box className="lg:col-span-1">{brand}</Box>

            {/* Nav + Social — grouped together on mobile, split on lg */}
            <Box className="lg:col-span-2">
              <Inline
                justify="start"
                align="start"
                wrap
                className="flex-col sm:flex-row gap-8 sm:gap-12 lg:justify-end"
              >
                <Box>{navigation}</Box>
                <Box>{social}</Box>
              </Inline>
            </Box>
          </Grid>

          <Divider color="rgba(255,255,255,0.08)" />

          {/* Copyright bar */}
          <Box className="text-sm text-slate-400">{copyright}</Box>
        </Stack>
      </Container>
    </footer>
  );
}
