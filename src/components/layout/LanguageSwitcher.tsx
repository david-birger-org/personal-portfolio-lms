"use client";

import { useParams, usePathname as useNextPathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = useNextPathname();
  const currentLocale = (params.locale as Locale) || "en";

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove the current locale from pathname if it exists
    const pathWithoutLocale = pathname.replace(/^\/(en|ua)/, '') || '/';
    router.replace(pathWithoutLocale as any, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            locale === currentLocale
              ? "text-white font-semibold underline"
              : "text-gray-400 hover:text-gray-200"
          }`}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
