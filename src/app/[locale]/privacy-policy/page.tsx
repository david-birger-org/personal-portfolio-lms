import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { legalContent } from "@/content/legal";
import { resolveLocale } from "@/i18n/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);
  const doc = legalContent[effectiveLocale].docs.privacy;

  return {
    title: doc.title,
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const effectiveLocale = resolveLocale(locale);

  return (
    <LegalDocument
      ui={legalContent[effectiveLocale].ui}
      doc={legalContent[effectiveLocale].docs.privacy}
    />
  );
}
