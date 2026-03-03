import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Music2,
  Youtube,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  CompactContactFormClient,
  ContactFormClient,
} from "@/components/sections/ContactFormClient";
import { SectionHeader } from "@/components/sections/SectionHeader";

type ContactVariant = "full" | "compact";

export async function Contact() {
  return <ContactSection variant="full" />;
}

export async function CompactContact() {
  return <ContactSection variant="compact" />;
}

async function ContactSection({ variant }: { variant: ContactVariant }) {
  const t = await getTranslations("contact");
  const isCompact = variant === "compact";

  const contactInfo = [
    {
      icon: Mail,
      title: t("info.email.title"),
      value: t("info.email.value"),
      link: `mailto:${t("info.email.value")}`,
      key: "email",
    },
    {
      icon: MapPin,
      title: t("info.location.title"),
      value: t("info.location.value"),
      link: null,
      key: "location",
    },
  ] as const;

  const consultationFeatures = t.raw("consultation.features") as string[];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gray-50 py-14 md:py-20"
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("tag")}
          title={t("title")}
          titleAccent={t("titleAccent")}
          description={t("description")}
          className={isCompact ? "mb-12" : "mb-20"}
        />

        <div
          className={`mx-auto grid gap-12 ${isCompact ? "max-w-3xl" : "max-w-6xl lg:grid-cols-2"}`}
        >
          {!isCompact && (
            <div className="order-2 flex h-full flex-col lg:order-1">
              <div className="mb-10">
                <h3 className="mb-4 text-2xl tracking-tight text-gray-900 sm:text-3xl">
                  {t("info.infoTitle")}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {t("info.infoDescription")}
                </p>
              </div>

              <div className="mb-10 space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.key} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-900">
                      <info.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-gray-600">
                        {info.title}
                      </div>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-lg font-medium text-gray-900 transition-colors hover:text-gray-700"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-lg font-medium text-gray-900">
                          {info.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-10">
                <h4 className="mb-4 text-sm font-medium text-gray-600">
                  {t("socials.title")}
                </h4>
                <div className="flex gap-3">
                  <a
                    href={t("socials.instagram")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6 text-[#E4405F] transition-colors group-hover:text-[#C13584]" />
                  </a>
                  <a
                    href={t("socials.facebook")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-6 w-6 text-[#1877F2] transition-colors group-hover:text-[#0C5DC6]" />
                  </a>
                  <a
                    href={t("socials.tiktok")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    aria-label="TikTok"
                  >
                    <Music2 className="h-5 w-5 text-gray-900 transition-colors group-hover:text-gray-700" />
                  </a>
                  <a
                    href={t("socials.youtube")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-6 w-6 text-[#FF0000] transition-colors group-hover:text-[#CC0000]" />
                  </a>
                </div>
              </div>

              <div className="mt-auto rounded-3xl border border-gray-200 bg-white p-8">
                <h4 className="mb-3 text-lg font-semibold tracking-tight text-gray-900">
                  {t("consultation.title")}
                </h4>
                <p className="mb-6 leading-relaxed text-gray-700">
                  {t("consultation.description")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {consultationFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="order-1 lg:order-2">
            {isCompact ? <CompactContactFormClient /> : <ContactFormClient />}
          </div>
        </div>
      </div>
    </section>
  );
}
