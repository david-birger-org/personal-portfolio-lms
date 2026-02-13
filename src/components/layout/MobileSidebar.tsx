"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LanguageSwitcherClient } from "@/components/layout/LanguageSwitcherClient";
import { Button } from "@/components/ui/button";
import { CONTACT_FORM_HREF } from "@/constants/links";
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
  const titleId = `${headerId}-mobile-nav-title-${locale}`;
  const collapsedRef = useRef(false);
  const activeSectionIdRef = useRef(sections[0]?.id ?? "");
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // Collapse/expand header — pure DOM, no React state
  useEffect(() => {
    const headerEl = document.getElementById(headerId);
    if (!headerEl) {
      return;
    }

    let mq: MediaQueryList | null = null;
    if (typeof window !== "undefined") {
      mq = window.matchMedia("(max-width: 767px)");
    }

    let rafId = 0;

    const updateCollapsed = () => {
      const isMobile = mq?.matches ?? true;
      if (!isMobile) {
        headerEl.dataset.mobileCollapsed = "false";
        collapsedRef.current = false;
        if (buttonRef.current) {
          buttonRef.current.dataset.collapsed = "false";
        }
        return;
      }

      const next = window.scrollY >= window.innerHeight;
      headerEl.dataset.mobileCollapsed = next ? "true" : "false";
      collapsedRef.current = next;
      if (buttonRef.current) {
        buttonRef.current.dataset.collapsed = next ? "true" : "false";
      }
    };

    updateCollapsed();

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCollapsed);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mq?.addEventListener("change", updateCollapsed);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      mq?.removeEventListener("change", updateCollapsed);
    };
  }, [headerId]);

  // Track active section — pure DOM, no React state
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

    const sectionRatios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          sectionRatios[id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        }

        let bestId = activeSectionIdRef.current;
        let bestRatio = -1;
        for (const section of sections) {
          const ratio = sectionRatios[section.id] ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = section.id;
          }
        }

        if (bestId && bestId !== activeSectionIdRef.current) {
          activeSectionIdRef.current = bestId;
          // Update button title directly — no React re-render
          if (buttonRef.current) {
            const home = sections.find((s) => s.id === "home");
            const active = sections.find((s) => s.id === bestId);
            if (active) {
              buttonRef.current.title =
                active.id === "home"
                  ? active.label
                  : `${home?.label ?? "Home"} / ${active.label}`;
            }
          }
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.25, 0.75],
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const initialBreadcrumb = useMemo(() => {
    const home = sections.find((s) => s.id === "home");
    return home?.label ?? "Home";
  }, [sections]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="md:hidden grid size-11 place-items-center text-gray-700 transition-all duration-200 hover:text-gray-900 rounded-none bg-transparent shadow-none data-[collapsed=true]:rounded-full data-[collapsed=true]:bg-gray-900 data-[collapsed=true]:text-white data-[collapsed=true]:shadow-lg data-[collapsed=true]:shadow-black/20"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
        title={initialBreadcrumb}
        data-collapsed="false"
        onClick={handleOpen}
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
          onClick={handleClose}
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
              onClick={handleClose}
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
                  onClick={handleClose}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex items-center justify-between gap-3">
              <LanguageSwitcherClient
                currentLocale={locale}
                onSelect={handleClose}
              />
              <Button asChild className="px-5">
                <Link href={CONTACT_FORM_HREF} onClick={handleClose}>
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
