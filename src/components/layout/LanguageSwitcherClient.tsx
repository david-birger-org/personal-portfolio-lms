"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageSwitcherView } from "@/components/layout/LanguageSwitcherView";
import { type Locale, locales } from "@/i18n/config";

interface LanguageSwitcherClientProps {
  currentLocale: Locale;
  className?: string;
  onSelect?: () => void;
}

export function LanguageSwitcherClient({
  currentLocale,
  className,
  onSelect,
}: LanguageSwitcherClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [hash, setHash] = useState("");

  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;
  const segments = normalizedPathname.split("/").filter(Boolean);

  while (segments[0] && locales.includes(segments[0] as Locale)) {
    segments.shift();
  }

  const pathnameWithoutLocale = segments.length
    ? `/${segments.join("/")}`
    : "/";

  useEffect(() => {
    setHash(window.location.hash);
  }, []);

  const suffix = pathnameWithoutLocale === "/" ? "" : pathnameWithoutLocale;
  const queryAndHash = `${search ? `?${search}` : ""}${hash}`;
  const hrefByLocale = locales.reduce<Record<Locale, string>>(
    (acc, locale) => {
      acc[locale] = `/${locale}${suffix}${queryAndHash}`;
      return acc;
    },
    {} as Record<Locale, string>,
  );

  return (
    <LanguageSwitcherView
      currentLocale={currentLocale}
      hrefByLocale={hrefByLocale}
      className={className}
      onSelect={onSelect}
      scroll={false}
    />
  );
}
