import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type React from "react";

import { MobileSectionLegend } from "@/components/sections/MobileSectionLegend";
import { biographyPhotos } from "@/content/biography";

type Locale = "en" | "ua";

interface BiographyParagraph {
  text: string;
  bold?: boolean;
}

interface BiographySection {
  heading: string;
  body: BiographyParagraph[];
}

interface BiographyContent {
  intro?: BiographyParagraph[];
  sections: BiographySection[];
}

interface BiographySectionData {
  id: string;
  title: string;
  paragraphs: BiographyParagraphWithId[];
}

interface BiographySplitResult {
  introParagraphs: BiographyParagraphWithId[];
  sections: BiographySectionData[];
}

const sloganText =
  "« ЯКЩО ТИ МОЖЕШ УЯВИТИ ЦЕ, ТО І МОЖЕШ ЗРОБИТИ – IF YOU CAN DREAM IT, YOU CAN DO IT »";
const sloganTextUaInline =
  "« ЯКЩО ТИ МОЖЕШ УЯВИТИ ЦЕ,\u00A0ТО І МОЖЕШ ЗРОБИТИ – IF YOU CAN DREAM IT, YOU CAN DO IT »";
const wnbfWebsiteText = "wnbfukraine.com.ua";
const wnbfWebsiteHref = "https://wnbfukraine.com.ua";

function renderSlogan(locale: Locale) {
  return locale === "ua" ? sloganTextUaInline : sloganText;
}

function renderParagraphText(text: string, locale: Locale) {
  const tokens = [sloganText, wnbfWebsiteText];
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    let nextIndex = -1;
    let nextToken = "";

    for (const token of tokens) {
      const index = text.indexOf(token, cursor);
      if (index === -1) {
        continue;
      }

      if (nextIndex === -1 || index < nextIndex) {
        nextIndex = index;
        nextToken = token;
      }
    }

    if (nextIndex === -1) {
      parts.push(text.slice(cursor));
      break;
    }

    if (nextIndex > cursor) {
      parts.push(text.slice(cursor, nextIndex));
    }

    if (nextToken === sloganText) {
      parts.push(
        <span
          key={`slogan-${nextIndex}`}
          className="font-semibold text-neutral-900"
        >
          {renderSlogan(locale)}
        </span>,
      );
    } else {
      parts.push(
        <a
          key={`wnbf-${nextIndex}`}
          href={wnbfWebsiteHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 transition-colors hover:text-neutral-700"
        >
          {wnbfWebsiteText}
        </a>,
      );
    }

    cursor = nextIndex + nextToken.length;
  }

  return <>{parts}</>;
}

interface BiographyParagraphWithId extends BiographyParagraph {
  id: string;
}

function addParagraphIds(paragraphs: BiographyParagraph[]) {
  return paragraphs.map((paragraph, index) => ({
    ...paragraph,
    id: `biography-${index}-${paragraph.text.slice(0, 24)}`,
  }));
}

function addParagraphIdsWithPrefix(
  paragraphs: BiographyParagraph[],
  prefix: string,
) {
  return paragraphs.map((paragraph, index) => ({
    ...paragraph,
    id: `${prefix}-${index}-${paragraph.text.slice(0, 24)}`,
  }));
}

function splitBiographyIntoSections(
  paragraphs: BiographyParagraphWithId[],
  headingTitles: string[],
): BiographySplitResult {
  const headingSet = new Set(headingTitles);
  const sections: BiographySectionData[] = [];
  const introParagraphs: BiographyParagraphWithId[] = [];
  let currentSection: BiographySectionData | null = null;

  for (const paragraph of paragraphs) {
    const normalizedText = paragraph.text.trim();
    const isHeading = headingSet.has(normalizedText);

    if (isHeading) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        id: `bio-section-${sections.length + 1}`,
        title: normalizedText,
        paragraphs: [],
      };

      continue;
    }

    if (currentSection) {
      currentSection.paragraphs.push(paragraph);
    } else {
      introParagraphs.push(paragraph);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  if (sections.length === 0 && introParagraphs.length > 0) {
    return {
      introParagraphs: [],
      sections: [
        {
          id: "bio-section-1",
          title: "Biography",
          paragraphs: introParagraphs,
        },
      ],
    };
  }

  return {
    introParagraphs,
    sections,
  };
}

function normalizeBiographyContent(
  biography: BiographyParagraph[] | BiographyContent,
  locale: Locale,
): BiographySplitResult {
  if (Array.isArray(biography)) {
    const paragraphsWithIds = addParagraphIds(biography);
    const headingTitles =
      locale === "ua"
        ? [
            "Дитинство",
            "Підлітковий вік",
            "Початок занять у залі",
            "Зацікавлення бодібілдингом та перші змагання",
            "Розвиток натурального бодібілдингу в Україні",
            "Здобуття статусу WNBF Pro та перший міжнародний турнір",
            "Шлях Нептуна",
            "Пам’ятний змагальний сезон 2025",
          ]
        : [
            "Childhood",
            "Adolescence",
            "Beginning in the Gym",
            "Interest in Bodybuilding and First Competitions",
            "Development of Natural Bodybuilding in Ukraine",
            "Earning WNBF Pro Status and the First International Tournament",
            "Path of Neptune",
            "Memorable 2025 Competitive Season",
          ];

    return splitBiographyIntoSections(paragraphsWithIds, headingTitles);
  }

  const introParagraphs = addParagraphIdsWithPrefix(
    biography.intro ?? [],
    "biography-intro",
  );
  const sections = biography.sections.map((section, sectionIndex) => ({
    id: `bio-section-${sectionIndex + 1}`,
    title: section.heading,
    paragraphs: addParagraphIdsWithPrefix(
      section.body,
      `biography-section-${sectionIndex + 1}`,
    ),
  }));

  return {
    introParagraphs,
    sections,
  };
}

function BiographySection({
  sections,
  imageAlt,
  locale,
}: {
  sections: BiographySectionData[];
  imageAlt: string;
  locale: Locale;
}) {
  return (
    <section>
      <div className="space-y-8 md:space-y-10">
        {sections.map((section, index) => {
          const shouldReverse = index % 2 !== 0;
          const photo = biographyPhotos[index % biographyPhotos.length];

          return (
            <article
              id={section.id}
              key={section.id}
              className="scroll-mt-20 overflow-hidden rounded-3xl border border-neutral-200 bg-white md:scroll-mt-24"
            >
              <div className="grid gap-0 lg:grid-cols-12">
                <div
                  className={`relative min-h-[260px] lg:col-span-5 ${shouldReverse ? "lg:order-2" : "lg:order-1"}`}
                >
                  <Image
                    src={photo}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 1024px) 35vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <div
                  className={`p-6 sm:p-8 md:p-10 lg:col-span-7 ${shouldReverse ? "lg:order-1" : "lg:order-2"}`}
                >
                  <h2 className="mb-5 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="space-y-5 text-sm leading-7 text-neutral-700 sm:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.id}
                        className={
                          paragraph.bold ? "font-semibold text-neutral-900" : ""
                        }
                      >
                        {renderParagraphText(paragraph.text, locale)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ua" ? "ua" : "en";
  const t = await getTranslations("aboutPage");

  const biography = t.raw("biography") as
    | BiographyParagraph[]
    | BiographyContent;
  const { introParagraphs, sections } = normalizeBiographyContent(
    biography,
    currentLocale,
  );

  return (
    <main className="min-h-screen bg-neutral-50 pt-28 pb-20 md:pt-32 md:pb-24">
      {introParagraphs.length > 0 ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8 rounded-3xl border border-neutral-200 bg-white py-6 sm:py-8 md:mb-10 md:py-10">
            <div className="space-y-4 px-4 text-sm leading-7 text-neutral-700 sm:px-6 sm:text-base lg:px-8">
              {introParagraphs.map((paragraph) => (
                <p
                  key={paragraph.id}
                  className={
                    paragraph.bold ? "font-semibold text-neutral-900" : ""
                  }
                >
                  {renderParagraphText(paragraph.text, currentLocale)}
                </p>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MobileSectionLegend
          sections={sections.map((section) => ({
            id: section.id,
            title: section.title,
          }))}
          label={currentLocale === "ua" ? "Легенда" : "Legend"}
          ariaLabel={
            currentLocale === "ua"
              ? "Мобільна навігація розділами"
              : "Mobile section navigation"
          }
        />

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                {currentLocale === "ua" ? "Легенда" : "Legend"}
              </p>
              <nav
                aria-label={
                  currentLocale === "ua"
                    ? "Навігація розділами"
                    : "Section navigation"
                }
              >
                <ul className="space-y-1.5">
                  {sections.map((section) => (
                    <li key={`legend-${section.id}`}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-lg px-2 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <BiographySection
            sections={sections}
            locale={currentLocale}
            imageAlt={
              currentLocale === "ua"
                ? "Фотографія спортивного шляху"
                : "Sport journey photo"
            }
          />
        </div>
      </div>
    </main>
  );
}
