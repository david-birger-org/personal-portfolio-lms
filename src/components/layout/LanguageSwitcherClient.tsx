"use client";

import { useEffect, useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

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
  const [search, setSearch] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateLocationParts = () => {
      setSearch(window.location.search);
      setHash(window.location.hash);
    };

    updateLocationParts();
    window.addEventListener("hashchange", updateLocationParts);
    window.addEventListener("popstate", updateLocationParts);

    return () => {
      window.removeEventListener("hashchange", updateLocationParts);
      window.removeEventListener("popstate", updateLocationParts);
    };
  }, []);

  const href = useMemo(() => {
    return `${pathname}${search}${hash}`;
  }, [hash, pathname, search]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={href}
          locale={locale}
          scroll={false}
          onClick={onSelect}
          className={cn(
            "rounded px-2 py-1 text-xs transition-colors",
            locale === currentLocale
              ? "bg-gray-900 font-semibold text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          )}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
