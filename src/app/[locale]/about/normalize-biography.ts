import type {
  BiographyContent,
  BiographyLocale,
  BiographyParagraph,
  BiographyParagraphWithId,
  BiographySectionData,
  BiographySplitResult,
} from "@/app/[locale]/about/types";

const SECTION_HEADINGS: Record<BiographyLocale, string[]> = {
  en: [
    "Childhood",
    "Adolescence",
    "Beginning in the Gym",
    "Interest in Bodybuilding and First Competitions",
    "Development of Natural Bodybuilding in Ukraine",
    "Earning WNBF Pro Status and the First International Tournament",
    "Path of Neptune",
    "Memorable 2025 Competitive Season",
  ],
  ua: [
    "Дитинство",
    "Підлітковий вік",
    "Початок занять у залі",
    "Зацікавлення бодібілдингом та перші змагання",
    "Розвиток натурального бодібілдингу в Україні",
    "Здобуття статусу WNBF Pro та перший міжнародний турнір",
    "Шлях Нептуна",
    "Пам’ятний змагальний сезон 2025",
  ],
};

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

export function normalizeBiographyContent(
  biography: BiographyParagraph[] | BiographyContent,
  locale: BiographyLocale,
): BiographySplitResult {
  if (Array.isArray(biography)) {
    const paragraphsWithIds = addParagraphIds(biography);
    return splitBiographyIntoSections(
      paragraphsWithIds,
      SECTION_HEADINGS[locale],
    );
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
