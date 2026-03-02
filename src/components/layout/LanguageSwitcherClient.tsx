"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageSwitcherView } from "@/components/layout/LanguageSwitcherView";
import type { Locale } from "@/i18n/config";
import { usePathname } from "@/i18n/routing";

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

  useEffect(() => {
    setHash(window.location.hash);
  }, []);

  const href = `${pathname}${search ? `?${search}` : ""}${hash}`;

  return (
    <LanguageSwitcherView
      currentLocale={currentLocale}
      href={href}
      className={className}
      onSelect={onSelect}
      scroll={false}
    />
  );
}
