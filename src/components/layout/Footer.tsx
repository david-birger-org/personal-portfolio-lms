import { Facebook, Instagram, Mail, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";

export async function Footer() {
  const t = await getTranslations("footer");
  const currentYear = new Date().getFullYear();

  const footerLinks: Record<string, Array<{ name: string; href: string }>> = {
    [t("servicesLinks.title")]: [
      { name: t("servicesLinks.personalTraining"), href: "/#services" },
      { name: t("servicesLinks.onlineCoaching"), href: "/#services" },
      { name: t("servicesLinks.nutritionPlanning"), href: "/#services" },
      { name: t("servicesLinks.transformationPrograms"), href: "/#services" },
    ],
    [t("navigation.title")]: [
      { name: t("navigation.home"), href: "/#home" },
      { name: t("navigation.about"), href: "/about" },
      { name: t("navigation.services"), href: "/#services" },
      { name: t("navigation.contact"), href: "/#contact" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "mailto:coach@fitcoach.com", label: "Email" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gray-950 pt-20 pb-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/#home" className="flex items-center gap-3 group mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo_image.svg"
                  alt="David Birger Logo"
                  fill
                  sizes="40px"
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div className="relative h-7 w-40">
                <Image
                  src="/logo_title.svg"
                  alt="David Birger"
                  fill
                  sizes="160px"
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </Link>

            <p className="mb-8 max-w-md leading-relaxed text-gray-300">
              {t("tagline")}
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white hover:text-gray-900"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-6 text-base font-semibold">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-16 rounded-3xl border border-white/15 bg-white/8 p-8 backdrop-blur-sm md:p-10">
          <div className="md:flex items-center justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">
                {t("newsletter.title")}
              </h3>
              <p className="text-gray-300">{t("newsletter.description")}</p>
            </div>
            <div className="flex w-full flex-col gap-3 md:min-w-[340px] md:flex-row">
              <input
                type="email"
                placeholder={t("newsletter.emailPlaceholder")}
                className="flex-1 rounded-2xl border border-white/20 bg-black/20 px-5 py-3 text-white placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="button"
                className="w-full whitespace-normal break-words rounded-xl bg-white px-4 py-2 text-center text-sm leading-snug font-medium text-gray-900 transition-all hover:-translate-y-0.5 hover:bg-gray-100 md:w-auto md:whitespace-nowrap md:px-5 md:py-2.5"
              >
                {t("newsletter.subscribeButton")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-sm text-gray-300 md:text-left">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex gap-8 text-sm">
            <Link
              href="/privacy-policy"
              className="text-gray-300 transition-colors hover:text-white"
            >
              {t("legal.privacyPolicy")}
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-300 transition-colors hover:text-white"
            >
              {t("legal.termsOfService")}
            </Link>
            <Link
              href="/cookie-policy"
              className="text-gray-300 transition-colors hover:text-white"
            >
              {t("legal.cookiePolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
