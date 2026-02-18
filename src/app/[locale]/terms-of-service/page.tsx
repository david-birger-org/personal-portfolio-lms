import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { legalContent } from "@/content/legal";
import { resolveLocale } from "@/i18n/locale";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);
  const doc = legalContent[effectiveLocale].docs.terms;

  return {
    title: doc.title,
  };
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
