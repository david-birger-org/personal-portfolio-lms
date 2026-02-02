"use client";

import { useCallback } from "react";

export function useSectionScroll() {
  const scrollTo = useCallback((id: string) => {
    const targetId = id.startsWith("#") ? id.substring(1) : id;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return scrollTo;
}
