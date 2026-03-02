"use client";

import dynamic from "next/dynamic";

import type { Locale } from "@/i18n/config";

const MobileSidebar = dynamic(
  () =>
    import("@/components/layout/MobileSidebar").then(
      (mod) => mod.MobileSidebar,
    ),
  {
    ssr: false,
    loading: () => <div className="size-11 md:hidden" aria-hidden="true" />,
  },
);

interface MobileSidebarLazyProps {
  headerId: string;
  locale: Locale;
  ctaText: string;
  items: Array<{ name: string; href: string }>;
  sections: Array<{ id: string; label: string }>;
}

export function MobileSidebarLazy(props: MobileSidebarLazyProps) {
  return <MobileSidebar {...props} />;
}
