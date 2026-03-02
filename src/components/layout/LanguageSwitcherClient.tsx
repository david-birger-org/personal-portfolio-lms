"use client";

import { useEffect, useMemo, useState } from "react";

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
    <LanguageSwitcherView
      currentLocale={currentLocale}
      href={href}
      className={className}
      onSelect={onSelect}
      scroll={false}
    />
  );
}
