import type React from "react";

import type { BiographyLocale } from "@/app/[locale]/about/types";

const sloganText =
  "« ЯКЩО ТИ МОЖЕШ УЯВИТИ ЦЕ, ТО І МОЖЕШ ЗРОБИТИ – IF YOU CAN DREAM IT, YOU CAN DO IT »";
const sloganTextUaInline =
  "« ЯКЩО ТИ МОЖЕШ УЯВИТИ ЦЕ,\u00A0ТО І МОЖЕШ ЗРОБИТИ – IF YOU CAN DREAM IT, YOU CAN DO IT »";
const wnbfWebsiteText = "wnbfukraine.com.ua";
const wnbfWebsiteHref = "https://wnbfukraine.com.ua";
const worldNaturalWebsiteText = "worldnaturalbb.com";

const websiteTokens = [
  {
    key: "wnbf",
    text: wnbfWebsiteText,
    href: wnbfWebsiteHref,
  },
  {
    key: "wnbf-world",
    text: worldNaturalWebsiteText,
    href: "https://worldnaturalbb.com",
  },
];

function renderSlogan(locale: BiographyLocale) {
  return locale === "ua" ? sloganTextUaInline : sloganText;
}

export function renderParagraphText(text: string, locale: BiographyLocale) {
  const tokens = [sloganText, ...websiteTokens.map((token) => token.text)];
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
      const websiteToken = websiteTokens.find(
        (token) => token.text === nextToken,
      );

      if (!websiteToken) {
        parts.push(nextToken);
        cursor = nextIndex + nextToken.length;
        continue;
      }

      parts.push(
        <a
          key={`${websiteToken.key}-${nextIndex}`}
          href={websiteToken.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 transition-colors hover:text-neutral-700"
        >
          {websiteToken.text}
        </a>,
      );
    }

    cursor = nextIndex + nextToken.length;
  }

  return <>{parts}</>;
}
