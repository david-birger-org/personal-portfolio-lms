export const POSTHOG_EVENTS = {
  ctaClicked: "cta_clicked",
  contactApiEmailSent: "contact_api_email_sent",
  contactFormSubmitFailed: "contact_form_submit_failed",
  contactFormSubmitted: "contact_form_submitted",
  contactFormViewed: "contact_form_viewed",
  languageSwitched: "language_switched",
  pageScrollDepthReached: "page_scroll_depth_reached",
  sectionViewed: "section_viewed",
  serviceRequestSubmitted: "service_request_submitted",
  socialLinkClicked: "social_link_clicked",
} as const;

export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "youtube";
