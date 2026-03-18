"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { capturePostHogEvent } from "@/lib/posthog-client";
import { POSTHOG_EVENTS } from "@/lib/posthog-events";

const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 90] as const;

function getScrollDepthPercentage() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) {
    return null;
  }

  return Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100));
}

export function PageScrollTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    reachedMilestonesRef.current = new Set();

    const trackDepth = () => {
      frameRef.current = null;

      const scrollDepthPercentage = getScrollDepthPercentage();

      if (scrollDepthPercentage === null) {
        return;
      }

      for (const milestone of SCROLL_DEPTH_MILESTONES) {
        if (
          scrollDepthPercentage >= milestone &&
          !reachedMilestonesRef.current.has(milestone)
        ) {
          reachedMilestonesRef.current.add(milestone);
          capturePostHogEvent(POSTHOG_EVENTS.pageScrollDepthReached, {
            locale,
            milestone_percent: milestone,
            path: pathname,
          });
        }
      }
    };

    const scheduleTrackDepth = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(trackDepth);
    };

    scheduleTrackDepth();

    window.addEventListener("scroll", scheduleTrackDepth, { passive: true });
    window.addEventListener("resize", scheduleTrackDepth);

    return () => {
      window.removeEventListener("scroll", scheduleTrackDepth);
      window.removeEventListener("resize", scheduleTrackDepth);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [locale, pathname]);

  return null;
}
