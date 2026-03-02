import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherViewProps {
  className?: string;
  currentLocale: Locale;
  hrefByLocale: Record<Locale, string>;
  onSelect?: () => void;
  scroll?: boolean;
}

export function LanguageSwitcherView({
  className,
  currentLocale,
  hrefByLocale,
  onSelect,
  scroll,
}: LanguageSwitcherViewProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefByLocale[locale]}
          scroll={scroll}
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
