"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { LanguageSwitcherClient } from "@/components/layout/LanguageSwitcherClient";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  headerId: string;
  locale: Locale;
  ctaText: string;
  items: Array<{ name: string; href: string }>;
  sections: Array<{ id: string; label: string }>;
}

export function MobileSidebar({
  headerId,
  locale,
  ctaText,
  items,
  sections,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const titleId = `${headerId}-mobile-nav-title-${locale}`;
  const sectionRatiosRef = useRef<Record<string, number>>({});
  const activeSectionIdRef = useRef(activeSectionId);

  useEffect(() => {
    activeSectionIdRef.current = activeSectionId;
  }, [activeSectionId]);

  const isMobileMediaQuery = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.matchMedia("(max-width: 767px)");
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    const headerEl = document.getElementById(headerId);
    if (!headerEl) {
      return;
    }

    const mq = isMobileMediaQuery;

    const updateCollapsed = () => {
      const isMobile = mq?.matches ?? true;
      if (!isMobile) {
        headerEl.dataset.mobileCollapsed = "false";
        setCollapsed(false);
        return;
      }

      const next = window.scrollY >= window.innerHeight;
      headerEl.dataset.mobileCollapsed = next ? "true" : "false";
      setCollapsed(next);
    };

    updateCollapsed();

    const onScroll = () => {
      requestAnimationFrame(updateCollapsed);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateCollapsed);
    mq?.addEventListener("change", updateCollapsed);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateCollapsed);
      mq?.removeEventListener("change", updateCollapsed);
    };
  }, [headerId, isMobileMediaQuery]);

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) {
      return;
    }

    const thresholds = [0, 0.1, 0.25, 0.5, 0.75, 1];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          sectionRatiosRef.current[id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        }

        let bestId = activeSectionIdRef.current;
        let bestRatio = -1;
        for (const section of sections) {
          const ratio = sectionRatiosRef.current[section.id] ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = section.id;
          }
        }

        if (!bestId) {
          return;
        }

        setActiveSectionId((prev) => (prev === bestId ? prev : bestId));
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: thresholds,
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const activeBreadcrumb = useMemo(() => {
    const home = sections.find((s) => s.id === "home");
    const active = sections.find((s) => s.id === activeSectionId);
    if (!active) {
      return home?.label ?? "";
    }
    if (active.id === "home") {
      return active.label;
    }
    return `${home?.label ?? "Home"} / ${active.label}`;
  }, [activeSectionId, sections]);

  return (
    <>
      <button
        type="button"
        className={cn(
          "md:hidden grid size-11 place-items-center text-gray-700 transition-all duration-200 hover:text-gray-900",
          collapsed
            ? "rounded-full bg-gray-900 text-white shadow-lg shadow-black/20"
            : "rounded-none bg-transparent text-gray-700 shadow-none",
        )}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
        title={activeBreadcrumb}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[85vw] border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div id={titleId} className="sr-only">
              Navigation
            </div>
            <button
              type="button"
              className="rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 py-5">
            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex items-center justify-between gap-3">
              <LanguageSwitcherClient
                currentLocale={locale}
                onSelect={() => setOpen(false)}
              />
              <Button asChild className="px-5">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  {ctaText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
