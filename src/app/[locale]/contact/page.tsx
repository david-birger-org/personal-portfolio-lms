import type { Metadata } from "next";

import { Contact } from "@/components/sections/Contact";
import { resolveLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo";

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
    path: "/contact",
    title:
      effectiveLocale === "ua"
        ? "Контакти Давіда Біргера"
        : "Contact David Birger",
    description:
      effectiveLocale === "ua"
        ? "Зв'яжіться для персонального супроводу, консультації, підготовки до змагань та уроків позування."
        : "Get in touch for personalized coaching, consultations, contest prep, and posing lessons.",
  });
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <Contact />
    </main>
  );
}
