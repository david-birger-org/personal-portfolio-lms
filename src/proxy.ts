import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, type Locale, locales } from "./i18n/config";
import { routing } from "./i18n/routing";

const nextIntlMiddleware = createMiddleware(routing);
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && locales.includes(value as Locale);
}

function getLocaleFromPathname(pathname: string): Locale | undefined {
  const [, segment] = pathname.split("/");
  return isLocale(segment) ? segment : undefined;
}

function getLocaleFromCountryHeader(request: NextRequest): Locale | undefined {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code");

  if (!country) {
    return undefined;
  }

  return country.toUpperCase() === "UA" ? "ua" : undefined;
}

function getLocaleFromAcceptLanguage(request: NextRequest): Locale | undefined {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) return undefined;

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

function resolvePreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  return (
    getLocaleFromCountryHeader(request) ??
    getLocaleFromAcceptLanguage(request) ??
    defaultLocale
  );
}

function persistLocale(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: "lax",
    path: "/",
  });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Reject file-extension requests that slip through the matcher.
  // Returning a 404 here prevents them from hitting the [locale] catch-all
  // segment, which would trigger next-intl's requestLocale → headers() call
  // and cause a static-to-dynamic runtime error.
  if (/\.\w+$/.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  const localeInPath = getLocaleFromPathname(pathname);

  if (!localeInPath) {
    const preferredLocale = resolvePreferredLocale(request);
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname =
      pathname === "/"
        ? `/${preferredLocale}`
        : `/${preferredLocale}${pathname}`;

    const response =
      pathname === "/"
        ? NextResponse.rewrite(redirectUrl)
        : NextResponse.redirect(redirectUrl);
    persistLocale(response, preferredLocale);

    return response;
  }

  const response = nextIntlMiddleware(request);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  if (cookieLocale !== localeInPath) {
    persistLocale(response, localeInPath);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel internals)
     * - Files with extensions (favicon.ico, sw.js, robots.txt, etc.)
     */
    "/((?!api|_next/static|_next/image|_vercel|favicon\\.ico|sw\\.js|sitemap\\.xml|robots\\.txt|.*\\.[\\w]+$).*)",
  ],
};
