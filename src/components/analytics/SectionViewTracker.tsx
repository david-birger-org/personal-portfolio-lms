"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { capturePostHogEvent } from "@/lib/posthog-client";
import { POSTHOG_EVENTS } from "@/lib/posthog-events";

interface SectionViewTrackerProps {
  locale: string;
  sectionId: string;
  sectionName: string;
}

export function SectionViewTracker({
  locale,
  sectionId,
  sectionName,
}: SectionViewTrackerProps) {
  const pathname = usePathname();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    hasTrackedRef.current = false;

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasTrackedRef.current) {
          return;
        }

        hasTrackedRef.current = true;
        capturePostHogEvent(POSTHOG_EVENTS.sectionViewed, {
          locale,
          path: pathname,
          section: sectionName,
          section_id: sectionId,
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [locale, pathname, sectionId, sectionName]);

  return null;
}
