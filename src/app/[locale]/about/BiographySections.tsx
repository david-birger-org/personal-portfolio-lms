import Image from "next/image";
import type {
  BiographyLocale,
  BiographySectionData,
  BiographyTextRenderer,
} from "@/app/[locale]/about/types";
import type { BiographyImageSelection } from "@/content/biography";

function paragraphClassName(isBold: boolean, paragraphIndex: number) {
  const leading =
    paragraphIndex === 0 ? "indent-8 text-justify" : "text-justify";

  if (isBold) {
    return `${leading} font-semibold text-neutral-900`;
  }

  return leading;
}

function renderParagraphs({
  paragraphs,
  startIndex,
  locale,
  renderText,
}: {
  paragraphs: BiographySectionData["paragraphs"];
  startIndex: number;
  locale: BiographyLocale;
  renderText: BiographyTextRenderer;
}) {
  return paragraphs.map((paragraph, index) => {
    const paragraphIndex = startIndex + index;

    return (
      <p
        key={paragraph.id}
        style={{
          textAlign: "justify",
          textIndent: paragraphIndex === 0 ? "2rem" : undefined,
        }}
        className={paragraphClassName(Boolean(paragraph.bold), paragraphIndex)}
      >
        {renderText(paragraph.text, locale)}
      </p>
    );
  });
}

export function BiographySections({
  sections,
  imageGroups,
  imageAlt,
  locale,
  renderText,
}: {
  sections: BiographySectionData[];
  imageGroups: BiographyImageSelection[];
  imageAlt: string;
  locale: BiographyLocale;
  renderText: BiographyTextRenderer;
}) {
  return (
    <section>
      <div className="space-y-8 md:space-y-10">
        {sections.map((section, index) => {
          const photoGroup = imageGroups[index] ?? [];
          const firstImage = photoGroup[0];
          const secondImage = photoGroup[1];
          const splitIndex = Math.ceil(section.paragraphs.length / 2);
          const topDesktopParagraphs = section.paragraphs.slice(0, splitIndex);
          const bottomDesktopParagraphs = section.paragraphs.slice(splitIndex);

          return (
            <article
              id={section.id}
              key={section.id}
              className="scroll-mt-20 overflow-hidden rounded-3xl border border-neutral-200 bg-white md:scroll-mt-24"
            >
              <div className="p-6 sm:p-8 md:p-10">
                <div className="lg:hidden">
                  {firstImage ? (
                    <div className="mb-5 lg:hidden">
                      <Image
                        src={firstImage}
                        alt={`${imageAlt} 1`}
                        width={1600}
                        height={1200}
                        sizes="100vw"
                        className="h-auto w-full rounded-2xl"
                      />
                    </div>
                  ) : null}
                  <h2 className="mb-5 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="space-y-5 text-sm leading-7 text-neutral-700 sm:text-base">
                    {renderParagraphs({
                      paragraphs: section.paragraphs,
                      startIndex: 0,
                      locale,
                      renderText,
                    })}
                  </div>
                  {secondImage ? (
                    <div className="mt-6 lg:hidden">
                      <Image
                        src={secondImage}
                        alt={`${imageAlt} 2`}
                        width={1600}
                        height={1200}
                        sizes="100vw"
                        className="h-auto w-full rounded-2xl"
                      />
                    </div>
                  ) : null}
                </div>

                {firstImage && secondImage ? (
                  <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
                    <div className="min-h-[420px] xl:min-h-[520px]">
                      <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl xl:min-h-[520px]">
                        <Image
                          src={firstImage}
                          alt={`${imageAlt} 1`}
                          fill
                          sizes="(min-width: 1280px) 24vw, 30vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>

                    <div>
                      <h2 className="mb-5 text-2xl font-semibold tracking-tight text-neutral-900">
                        {section.title}
                      </h2>
                      <div className="space-y-5 text-base leading-7 text-neutral-700">
                        {renderParagraphs({
                          paragraphs: topDesktopParagraphs,
                          startIndex: 0,
                          locale,
                          renderText,
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="space-y-5 text-base leading-7 text-neutral-700">
                        {renderParagraphs({
                          paragraphs: bottomDesktopParagraphs,
                          startIndex: splitIndex,
                          locale,
                          renderText,
                        })}
                      </div>
                    </div>

                    <div className="min-h-[420px] xl:min-h-[520px] lg:self-end">
                      <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl xl:min-h-[520px]">
                        <Image
                          src={secondImage}
                          alt={`${imageAlt} 2`}
                          fill
                          sizes="(min-width: 1280px) 24vw, 30vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                ) : firstImage ? (
                  <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
                    <div className="relative min-h-[420px] overflow-hidden rounded-2xl xl:min-h-[520px]">
                      <Image
                        src={firstImage}
                        alt={`${imageAlt} 1`}
                        fill
                        sizes="(min-width: 1280px) 24vw, 30vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div>
                      <h2 className="mb-5 text-2xl font-semibold tracking-tight text-neutral-900">
                        {section.title}
                      </h2>
                      <div className="space-y-5 text-base leading-7 text-neutral-700">
                        {renderParagraphs({
                          paragraphs: topDesktopParagraphs,
                          startIndex: 0,
                          locale,
                          renderText,
                        })}
                      </div>
                    </div>
                    {bottomDesktopParagraphs.length > 0 ? (
                      <div className="col-span-2">
                        <div className="space-y-5 text-base leading-7 text-neutral-700">
                          {renderParagraphs({
                            paragraphs: bottomDesktopParagraphs,
                            startIndex: splitIndex,
                            locale,
                            renderText,
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="hidden lg:block">
                    <h2 className="mb-5 text-2xl font-semibold tracking-tight text-neutral-900">
                      {section.title}
                    </h2>
                    <div className="space-y-5 text-base leading-7 text-neutral-700">
                      {renderParagraphs({
                        paragraphs: section.paragraphs,
                        startIndex: 0,
                        locale,
                        renderText,
                      })}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
