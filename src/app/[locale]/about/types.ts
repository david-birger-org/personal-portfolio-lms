import type React from "react";

import type { Locale } from "@/i18n/config";

export type BiographyLocale = Locale;

export interface BiographyParagraph {
  text: string;
  bold?: boolean;
}

export interface BiographySection {
  heading: string;
  body: BiographyParagraph[];
}

export interface BiographyContent {
  intro?: BiographyParagraph[];
  sections: BiographySection[];
}

export interface BiographyParagraphWithId extends BiographyParagraph {
  id: string;
}

export interface BiographySectionData {
  id: string;
  title: string;
  paragraphs: BiographyParagraphWithId[];
}

export interface BiographySplitResult {
  introParagraphs: BiographyParagraphWithId[];
  sections: BiographySectionData[];
}

export interface ParagraphRenderProps {
  paragraph: BiographyParagraphWithId;
  paragraphIndex: number;
  locale: BiographyLocale;
}

export type BiographyTextRenderer = (
  text: string,
  locale: BiographyLocale,
) => React.ReactNode;
