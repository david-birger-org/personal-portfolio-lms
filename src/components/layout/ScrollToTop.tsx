"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    let rafId = 0;

    const update = () => {
      const visible = window.scrollY > 300;
      el.dataset.visible = visible ? "true" : "false";
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      variant="outline"
      size="icon"
      data-visible="false"
      className="fixed right-4 bottom-4 z-50 border-neutral-200 bg-white text-neutral-800 shadow-sm transition-all duration-200 hover:bg-neutral-50 hover:text-neutral-900 md:right-8 md:bottom-8 data-[visible=false]:opacity-0 data-[visible=false]:scale-90 data-[visible=false]:pointer-events-none data-[visible=true]:scale-100 data-[visible=true]:opacity-100"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
}
