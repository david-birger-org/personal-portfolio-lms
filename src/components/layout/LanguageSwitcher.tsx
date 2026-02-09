"use client";

import { useLocale } from "next-intl";
import { type Locale, localeNames, locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  onSelect?: () => void;
}

export function LanguageSwitcher({
  className,
  onSelect,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      return;
    }

    router.replace(pathname, { locale: newLocale });
    onSelect?.();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {locales.map((locale) => (
        <button
          type="button"
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className={cn(
            "rounded px-2 py-1 text-xs transition-colors",
            locale === currentLocale
              ? "bg-gray-900 font-semibold text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          )}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
