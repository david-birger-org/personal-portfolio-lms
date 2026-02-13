import { getTranslations } from "next-intl/server";

import { BiographyIntroCard } from "@/app/[locale]/about/BiographyIntroCard";
import {
  BiographyDesktopLegend,
  BiographyMobileLegend,
} from "@/app/[locale]/about/BiographyLegend";
import { BiographySections } from "@/app/[locale]/about/BiographySections";
import { normalizeBiographyContent } from "@/app/[locale]/about/normalize-biography";
import { renderParagraphText } from "@/app/[locale]/about/rich-text";
import type {
  BiographyContent,
  BiographyParagraph,
} from "@/app/[locale]/about/types";
import {
  discoverBiographyImagesBySeries,
  resolveBiographyImageGroup,
} from "@/content/biography";
import { resolveLocale } from "@/i18n/locale";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = resolveLocale(locale);
  const t = await getTranslations("aboutPage");

  const biography = t.raw("biography") as
    | BiographyParagraph[]
    | BiographyContent;
  const { introParagraphs, sections } = normalizeBiographyContent(
    biography,
    currentLocale,
  );
  const imagesBySeries = await discoverBiographyImagesBySeries();
  const imageGroups = sections.map((section) =>
    resolveBiographyImageGroup(section.title, imagesBySeries),
  );

  return (
    <main className="min-h-screen bg-neutral-50 pt-28 pb-20 md:pt-32 md:pb-24">
      <BiographyIntroCard
        introParagraphs={introParagraphs}
        locale={currentLocale}
        renderText={renderParagraphText}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BiographyMobileLegend sections={sections} locale={currentLocale} />

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <BiographyDesktopLegend sections={sections} locale={currentLocale} />
          <BiographySections
            sections={sections}
            imageGroups={imageGroups}
            locale={currentLocale}
            imageAlt={
              currentLocale === "ua"
                ? "Фотографія спортивного шляху"
                : "Sport journey photo"
            }
            renderText={renderParagraphText}
          />
        </div>
      </div>
    </main>
  );
}
