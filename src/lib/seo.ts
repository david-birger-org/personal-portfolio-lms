import type { Metadata } from "next";

import { defaultLocale, type Locale, locales } from "@/i18n/config";

const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl =
    configuredUrl && configuredUrl.length > 0
      ? configuredUrl
      : FALLBACK_SITE_URL;

  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

export function getLocalizedPath(locale: Locale, path = "/"): string {
  if (path === "/") {
    return `/${locale}`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

export function getLocalizedUrl(locale: Locale, path = "/"): string {
  return `${getSiteUrl()}${getLocalizedPath(locale, path)}`;
}

function getLanguageAlternates(path: string): Record<string, string> {
  const alternates = Object.fromEntries(
    locales.map((locale) => [locale, getLocalizedUrl(locale, path)]),
  );

  return {
    ...alternates,
    "x-default": getLocalizedUrl(defaultLocale, path),
  };
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = getLocalizedUrl(locale, path);
  const ogLocale = locale === "ua" ? "uk_UA" : "en_US";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: "David Birger",
      locale: ogLocale,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createPersonJsonLd(locale: Locale): Record<string, unknown> {
  const personDescription =
    locale === "ua"
      ? "Тренер з натурального бодібілдингу, віцечемпіон світу WNBF, тренер із позування та підготовки до змагань."
      : "Natural bodybuilding coach, WNBF vice world champion, and contest prep specialist.";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${getLocalizedUrl(locale)}/#person`,
    name: "David Birger",
    url: getLocalizedUrl(locale),
    jobTitle:
      locale === "ua"
        ? "Тренер з натурального бодібілдингу"
        : "Natural Bodybuilding Coach",
    description: personDescription,
    knowsLanguage: locale === "ua" ? ["uk", "en"] : ["en", "uk"],
  };
}

export function createWebsiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    url: getLocalizedUrl(locale),
    name: "David Birger",
    inLanguage: locale === "ua" ? "uk" : "en",
    publisher: {
      "@id": `${getLocalizedUrl(locale)}/#person`,
    },
  };
}

export function createServicesJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${getLocalizedUrl(locale, "/services")}/#service`,
    serviceType:
      locale === "ua"
        ? "Послуги тренера з натурального бодібілдингу"
        : "Natural bodybuilding coaching services",
    provider: {
      "@type": "Person",
      "@id": `${getLocalizedUrl(locale)}/#person`,
      name: "David Birger",
    },
    areaServed: "Worldwide",
    url: getLocalizedUrl(locale, "/services"),
    inLanguage: locale === "ua" ? "uk" : "en",
  };
}
