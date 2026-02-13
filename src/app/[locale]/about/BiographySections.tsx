import Image from "next/image";
import type {
  BiographyLocale,
  BiographySectionData,
  BiographyTextRenderer,
} from "@/app/[locale]/about/types";
import { biographyPhotos } from "@/content/biography";

function paragraphClassName(isBold: boolean, paragraphIndex: number) {
  const leading =
    paragraphIndex === 0 ? "indent-8 text-justify" : "text-justify";

  if (isBold) {
    return `${leading} font-semibold text-neutral-900`;
  }

  return leading;
}

export function BiographySections({
  sections,
  imageAlt,
  locale,
  renderText,
}: {
  sections: BiographySectionData[];
  imageAlt: string;
  locale: BiographyLocale;
  renderText: BiographyTextRenderer;
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
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
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
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
