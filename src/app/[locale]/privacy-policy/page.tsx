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
  const doc = legalContent[effectiveLocale].docs.privacy;

  return buildPageMetadata({
    locale: effectiveLocale,
    path: "/privacy-policy",
    title: doc.title,
    description:
      effectiveLocale === "ua"
        ? "Політика конфіденційності щодо обробки персональних даних на сайті Давіда Біргера."
        : "Privacy policy describing how personal data is processed on David Birger's website.",
  });
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
