import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, type Locale, locales } from "@/i18n/config";

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && locales.includes(value as Locale);
}

function getLocaleFromCountryHeader(country: string | null) {
  if (!country) {
    return undefined;
  }

  return country.toUpperCase() === "UA" ? "ua" : undefined;
}

function getLocaleFromAcceptLanguage(acceptLanguage: string | null) {
  if (!acceptLanguage) {
    return undefined;
  }

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().toLowerCase().split(";");
      const tag = rawTag.trim();
      const base = tag.split("-")[0];

      let quality = 1;
      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key === "q") {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) quality = parsed;
        }
      }

      return { tag, base, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const preference of preferences) {
    if (preference.tag === "uk" || preference.base === "uk") return "ua";
    if (preference.tag === "en" || preference.base === "en") return "en";
  }

  return undefined;
}

export default async function RootPage() {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : (getLocaleFromCountryHeader(
        requestHeaders.get("x-vercel-ip-country") ??
          requestHeaders.get("cf-ipcountry") ??
          requestHeaders.get("x-country-code"),
      ) ??
      getLocaleFromAcceptLanguage(requestHeaders.get("accept-language")) ??
      defaultLocale);

  redirect(`/${locale}`);
}
