"use client";

import { Facebook, Instagram, Music2, Youtube } from "lucide-react";

import { capturePostHogEvent } from "@/lib/posthog-client";
import { POSTHOG_EVENTS, type SocialPlatform } from "@/lib/posthog-events";

interface SocialLinksClientProps {
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
}

const socialLinkClassName =
  "group flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md";

export function SocialLinksClient({
  instagram,
  facebook,
  tiktok,
  youtube,
}: SocialLinksClientProps) {
  const socialLinks = [
    {
      platform: "instagram" as const,
      href: instagram,
      label: "Instagram",
      icon: Instagram,
      iconClassName:
        "h-6 w-6 text-[#E4405F] transition-colors group-hover:text-[#C13584]",
    },
    {
      platform: "facebook" as const,
      href: facebook,
      label: "Facebook",
      icon: Facebook,
      iconClassName:
        "h-6 w-6 text-[#1877F2] transition-colors group-hover:text-[#0C5DC6]",
    },
    {
      platform: "tiktok" as const,
      href: tiktok,
      label: "TikTok",
      icon: Music2,
      iconClassName:
        "h-5 w-5 text-gray-900 transition-colors group-hover:text-gray-700",
    },
    {
      platform: "youtube" as const,
      href: youtube,
      label: "YouTube",
      icon: Youtube,
      iconClassName:
        "h-6 w-6 text-[#FF0000] transition-colors group-hover:text-[#CC0000]",
    },
  ] satisfies Array<{
    href: string;
    icon: typeof Instagram;
    iconClassName: string;
    label: string;
    platform: SocialPlatform;
  }>;

  const handleSocialClick = (platform: SocialPlatform, href: string) => {
    capturePostHogEvent(POSTHOG_EVENTS.socialLinkClicked, {
      platform,
      href,
    });
  };

  return (
    <div className="flex gap-3">
      {socialLinks.map(
        ({ href, icon: Icon, iconClassName, label, platform }) => (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={socialLinkClassName}
            aria-label={label}
            onClick={() => handleSocialClick(platform, href)}
          >
            <Icon className={iconClassName} />
          </a>
        ),
      )}
    </div>
  );
}
