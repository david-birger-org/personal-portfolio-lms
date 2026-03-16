import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { legalContent } from "@/content/legal";
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
  const doc = legalContent[effectiveLocale].docs.cookies;

  return buildPageMetadata({
    locale: effectiveLocale,
    path: "/cookie-policy",
    title: doc.title,
    description:
      effectiveLocale === "ua"
        ? "Політика використання cookie та подібних технологій на сайті Давіда Біргера."
        : "Cookie policy explaining cookie usage and related technologies on David Birger's website.",
  });
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);

  return (
    <LegalDocument
      ui={legalContent[effectiveLocale].ui}
      doc={legalContent[effectiveLocale].docs.cookies}
    />
  );
}
