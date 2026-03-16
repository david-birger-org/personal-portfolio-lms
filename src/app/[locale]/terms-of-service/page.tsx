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
  const doc = legalContent[effectiveLocale].docs.terms;

  return buildPageMetadata({
    locale: effectiveLocale,
    path: "/terms-of-service",
    title: doc.title,
    description:
      effectiveLocale === "ua"
        ? "Умови використання сайту та послуг Давіда Біргера."
        : "Terms of service for using David Birger's website and coaching services.",
  });
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);

  return (
    <LegalDocument
      ui={legalContent[effectiveLocale].ui}
      doc={legalContent[effectiveLocale].docs.terms}
    />
  );
}
