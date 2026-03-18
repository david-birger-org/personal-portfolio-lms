"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

import { Link } from "@/i18n/routing";
import { capturePostHogEvent } from "@/lib/posthog-client";
import { POSTHOG_EVENTS } from "@/lib/posthog-events";

type AnalyticsPropertyValue = boolean | null | number | string | undefined;

interface TrackedLinkProps
  extends Omit<ComponentProps<typeof Link>, "href" | "onClick"> {
  href: string;
  analyticsId: string;
  analyticsSection: string;
  analyticsProperties?: Record<string, AnalyticsPropertyValue>;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function TrackedLink({
  analyticsId,
  analyticsProperties,
  analyticsSection,
  href,
  onClick,
  ...props
}: TrackedLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    capturePostHogEvent(POSTHOG_EVENTS.ctaClicked, {
      cta_id: analyticsId,
      destination: href,
      path: pathname,
      section: analyticsSection,
      ...analyticsProperties,
    });
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
