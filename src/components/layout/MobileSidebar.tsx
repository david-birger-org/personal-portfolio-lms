"use client";

import { Menu, X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

interface MobileSidebarContextValue {
  buttonRef: RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
  initialBreadcrumb: string;
  items: Array<{ name: string; href: string }>;
  locale: Locale;
  open: boolean;
  openMenu: () => void;
  titleId: string;
  ctaText: string;
}

const MobileSidebarContext = createContext<MobileSidebarContextValue | null>(
  null,
);

function useMobileSidebarContext() {
  const context = useContext(MobileSidebarContext);
  if (!context) {
    throw new Error("MobileSidebar context must be used within provider");
  }
  return context;
}

function useBodyScrollLock(open: boolean) {
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
}

function useHeaderCollapsedState({
  buttonRef,
  headerId,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  headerId: string;
}) {
  useEffect(() => {
    const headerEl = document.getElementById(headerId);
    if (!headerEl) {
      return;
    }

    const mq = window.matchMedia("(max-width: 767px)");
    let rafId = 0;

    const updateCollapsed = () => {
      if (!mq.matches) {
        headerEl.dataset.mobileCollapsed = "false";
        if (buttonRef.current) {
          buttonRef.current.dataset.collapsed = "false";
        }
        return;
      }

      const nextCollapsed = window.scrollY >= window.innerHeight;
      const collapsedState = nextCollapsed ? "true" : "false";
      headerEl.dataset.mobileCollapsed = collapsedState;
      if (buttonRef.current) {
        buttonRef.current.dataset.collapsed = collapsedState;
      }
    };

    updateCollapsed();

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCollapsed);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", updateCollapsed);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", updateCollapsed);
    };
  }, [buttonRef, headerId]);
}

function useActiveSectionBreadcrumb({
  buttonRef,
  sections,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  sections: Array<{ id: string; label: string }>;
}) {
  const activeSectionIdRef = useRef(sections[0]?.id ?? "");

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    const elements = sections
      .map((section) => document.getElementById(section.id))
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
          if (buttonRef.current) {
            const home = sections.find((section) => section.id === "home");
            const active = sections.find((section) => section.id === bestId);
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

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [buttonRef, sections]);
}

function MobileSidebarProvider({
  children,
  ctaText,
  headerId,
  items,
  locale,
  sections,
}: MobileSidebarProps & { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const titleId = `${headerId}-mobile-nav-title-${locale}`;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(open);
  useHeaderCollapsedState({ buttonRef, headerId });
  useActiveSectionBreadcrumb({ buttonRef, sections });

  const initialBreadcrumb = useMemo(() => {
    const home = sections.find((section) => section.id === "home");
    return home?.label ?? "Home";
  }, [sections]);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const contextValue = useMemo(
    () => ({
      buttonRef,
      closeMenu,
      ctaText,
      initialBreadcrumb,
      items,
      locale,
      open,
      openMenu,
      titleId,
    }),
    [
      closeMenu,
      ctaText,
      initialBreadcrumb,
      items,
      locale,
      open,
      openMenu,
      titleId,
    ],
  );

  return (
    <MobileSidebarContext.Provider value={contextValue}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

function MobileSidebarTrigger() {
  const { buttonRef, initialBreadcrumb, open, openMenu } =
    useMobileSidebarContext();

  return (
    <button
      ref={buttonRef}
      type="button"
      className="md:hidden grid size-11 place-items-center text-gray-700 transition-all duration-200 hover:text-gray-900 rounded-none bg-transparent shadow-none data-[collapsed=true]:rounded-full data-[collapsed=true]:bg-gray-900 data-[collapsed=true]:text-white data-[collapsed=true]:shadow-lg data-[collapsed=true]:shadow-black/20"
      aria-label="Open navigation"
      aria-haspopup="dialog"
      aria-expanded={open}
      title={initialBreadcrumb}
      data-collapsed="false"
      onClick={openMenu}
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}

function MobileSidebarPanel() {
  const { closeMenu, ctaText, items, locale, open, titleId } =
    useMobileSidebarContext();

  return (
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
        onClick={closeMenu}
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
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div id={titleId} className="sr-only">
            Navigation
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            aria-label="Close menu"
            onClick={closeMenu}
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
                onClick={closeMenu}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex items-center justify-between gap-3">
            <LanguageSwitcherClient
              currentLocale={locale}
              onSelect={closeMenu}
            />
            <Button asChild className="px-5">
              <Link href={CONTACT_FORM_HREF} onClick={closeMenu}>
                {ctaText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar(props: MobileSidebarProps) {
  return (
    <MobileSidebarProvider {...props}>
      <MobileSidebarTrigger />
      <MobileSidebarPanel />
    </MobileSidebarProvider>
  );
}
