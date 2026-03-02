import { LanguageSwitcherView } from "@/components/layout/LanguageSwitcherView";
import type { Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  return (
    <LanguageSwitcherView
      currentLocale={currentLocale}
      href="/"
      className={className}
    />
  );
}
