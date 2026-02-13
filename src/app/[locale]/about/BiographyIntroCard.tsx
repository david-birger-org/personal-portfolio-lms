import type {
  BiographyLocale,
  BiographyParagraphWithId,
  BiographyTextRenderer,
} from "@/app/[locale]/about/types";

function paragraphClassName(isBold: boolean, paragraphIndex: number) {
  const leading =
    paragraphIndex === 0 ? "indent-8 text-justify" : "text-justify";

  if (isBold) {
    return `${leading} font-semibold text-neutral-900`;
  }

  return leading;
}

export function BiographyIntroCard({
  introParagraphs,
  locale,
  renderText,
}: {
  introParagraphs: BiographyParagraphWithId[];
  locale: BiographyLocale;
  renderText: BiographyTextRenderer;
}) {
  if (!introParagraphs.length) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-3xl border border-neutral-200 bg-white py-6 sm:py-8 md:mb-10 md:py-10">
        <div className="space-y-4 px-4 text-sm leading-7 text-neutral-700 sm:px-6 sm:text-base lg:px-8">
          {introParagraphs.map((paragraph, paragraphIndex) => (
            <p
              key={paragraph.id}
              style={{
                textAlign: "justify",
                textIndent: paragraphIndex === 0 ? "2rem" : undefined,
              }}
              className={paragraphClassName(
                Boolean(paragraph.bold),
                paragraphIndex,
              )}
            >
              {renderText(paragraph.text, locale)}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
