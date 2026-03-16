import type { Metadata } from "next";

import { Services } from "@/components/sections/Services";
import { resolveLocale } from "@/i18n/locale";
import { buildPageMetadata, createServicesJsonLd } from "@/lib/seo";

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
    path: "/services",
    title:
      effectiveLocale === "ua"
        ? "Послуги тренера з натурального бодібілдингу"
        : "Natural Bodybuilding Coaching Services",
    description:
      effectiveLocale === "ua"
        ? "Індивідуальні послуги: підготовка до змагань, рекомпозиція, набір м'язової маси та уроки позування."
        : "Personalized coaching services for contest prep, body recomposition, muscle gain, and posing lessons.",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);
  const servicesJsonLd = createServicesJsonLd(effectiveLocale);

  return (
    <main className="bg-gray-100">
      <script type="application/ld+json">
        {JSON.stringify(servicesJsonLd)}
      </script>
      <Services locale={locale} />
    </main>
  );
}
