import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LanguageSwitcherViewProps {
  className?: string;
  currentLocale: Locale;
  href: string;
  onSelect?: () => void;
  scroll?: boolean;
}

export function LanguageSwitcherView({
  className,
  currentLocale,
  href,
  onSelect,
  scroll,
}: LanguageSwitcherViewProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={href}
          locale={locale}
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
