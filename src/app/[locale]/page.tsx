import type { Metadata } from "next";
import { Suspense } from "react";

import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { About } from "@/components/sections/About";
import { AboutFeatureCards } from "@/components/sections/AboutFeatureCards";
import { CTA } from "@/components/sections/CTA";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Testimonials } from "@/components/sections/Testimonials";
import { resolveLocale } from "@/i18n/locale";
import {
  buildPageMetadata,
  createPersonJsonLd,
  createWebsiteJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);

  return buildPageMetadata({
    locale: effectiveLocale,
    path: "/",
    title:
      effectiveLocale === "ua"
        ? "Дaвід Біргер - Тренер з натурального бодібілдингу і Віцечемпіон світу WNBF"
        : "David Birger - Natural Bodybuilding Coach and WNBF Pro",
    description:
      effectiveLocale === "ua"
        ? "20+ років досвіду у спорті. Допомагаю будувати твою кращу версію себе через дисципліну, естетику й натуральний бодібілдинг."
        : "Natural bodybuilding coaching with contest prep, posing lessons, body recomposition, and muscle gain plans.",
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);
  const personJsonLd = createPersonJsonLd(effectiveLocale);
  const websiteJsonLd = createWebsiteJsonLd(effectiveLocale);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </script>
      <ScrollProgress />

      <main>
        <Hero locale={locale} />
        <Suspense fallback={null}>
          <AboutFeatureCards />
        </Suspense>
        <Suspense fallback={null}>
          <About />
        </Suspense>
        <Suspense fallback={null}>
          <Journey />
        </Suspense>
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={null}>
          <CTA locale={locale} />
        </Suspense>
      </main>
    </div>
  );
}
