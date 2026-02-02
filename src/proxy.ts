import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const nextIntlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Manual redirect for Ukrainian browser language to our /ua locale
  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language");
    const hasLocaleCookie = request.cookies.has("NEXT_LOCALE");

    if (!hasLocaleCookie && acceptLanguage) {
      const isUkrainian = acceptLanguage
        .toLowerCase()
        .split(",")
        .some((lang) => lang.trim().startsWith("uk"));

      if (isUkrainian) {
        return NextResponse.redirect(new URL("/ua", request.url));
      }
    }
  }

  const response = nextIntlMiddleware(request);

  // If we are at root and no redirect was issued by next-intl, force one
  if (pathname === "/" && !response.headers.get("location")) {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
