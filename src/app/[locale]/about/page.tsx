import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type React from "react";

import { biographyPhotos } from "@/content/biography";

type Locale = "en" | "ua";

interface BiographySectionProps {
  chunks: BiographyParagraphWithId[][];
  sectionClassName: string;
  reverseOnEven: boolean;
  photoOffset: number;
  imageAlt: string;
}

interface BiographyParagraph {
  text: string;
  bold?: boolean;
}

const sloganText =
  "« ЯКЩО ТИ МОЖЕШ УЯВИТИ ЦЕ, ТО І МОЖЕШ ЗРОБИТИ – IF YOU CAN DREAM IT, YOU CAN DO IT »";
const wnbfWebsiteText = "wnbfukraine.com.ua";
const wnbfWebsiteHref = "https://wnbfukraine.com.ua";

function renderParagraphText(text: string) {
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
          {sloganText}
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

function chunkParagraphs(paragraphs: BiographyParagraphWithId[], size: number) {
  const chunks: BiographyParagraphWithId[][] = [];

  for (let i = 0; i < paragraphs.length; i += size) {
    chunks.push(paragraphs.slice(i, i + size));
  }

  return chunks;
}

function getChunkSizeForMaxBlocks(paragraphCount: number, maxBlocks: number) {
  const safeMaxBlocks = Math.max(1, maxBlocks);
  return Math.max(1, Math.ceil(paragraphCount / safeMaxBlocks));
}

function BiographySection({
  chunks,
  sectionClassName,
  reverseOnEven,
  photoOffset,
  imageAlt,
}: BiographySectionProps) {
  return (
    <section className={sectionClassName}>
      <div className="space-y-8 md:space-y-10">
        {chunks.map((chunk, index) => {
          const shouldReverse = reverseOnEven
            ? index % 2 === 0
            : index % 2 !== 0;
          const photo =
            biographyPhotos[(index + photoOffset) % biographyPhotos.length];

          return (
            <article
              key={`${chunk[0]?.id ?? "biography"}-${photoOffset}`}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white"
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
                  <div className="space-y-5 text-sm leading-7 text-neutral-700 sm:text-base">
                    {chunk.map((paragraph) => (
                      <p key={paragraph.id}>
                        {renderParagraphText(paragraph.text)}
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

  const paragraphs = t.raw("biography") as BiographyParagraph[];
  const paragraphsWithIds = addParagraphIds(paragraphs);
  const maxBlocks = 10;
  const chunkSize = getChunkSizeForMaxBlocks(
    paragraphsWithIds.length,
    maxBlocks,
  );
  const chunks = chunkParagraphs(paragraphsWithIds, chunkSize);

  return (
    <main className="min-h-screen bg-neutral-50 pt-28 pb-20 md:pt-32 md:pb-24">
      <BiographySection
        chunks={chunks}
        sectionClassName="container mx-auto px-4 sm:px-6 lg:px-8"
        reverseOnEven={false}
        photoOffset={0}
        imageAlt={
          currentLocale === "ua"
            ? "Фотографія спортивного шляху"
            : "Sport journey photo"
        }
      />
    </main>
  );
}
