"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const next = window.scrollY > 300;
      setIsVisible((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      variant="outline"
      size="icon"
      className={cn(
        "fixed right-4 bottom-4 z-50 border-neutral-200 bg-white text-neutral-800 shadow-sm transition-all duration-200 hover:bg-neutral-50 hover:text-neutral-900 md:right-8 md:bottom-8",
        isVisible
          ? "scale-100 opacity-100"
          : "opacity-0 scale-90 pointer-events-none",
      )}
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
}
