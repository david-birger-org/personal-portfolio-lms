"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const t = useTranslations("footer");
  const scrollTo = useSectionScroll();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    [t("servicesLinks.title")]: [
      { name: t("servicesLinks.personalTraining"), href: "#services" },
      { name: t("servicesLinks.onlineCoaching"), href: "#services" },
      { name: t("servicesLinks.nutritionPlanning"), href: "#services" },
      { name: t("servicesLinks.transformationPrograms"), href: "#services" },
    ],
    [t("navigation.title")]: [
      { name: t("navigation.home"), href: "#home" },
      { name: t("navigation.about"), href: "#about" },
      { name: t("navigation.services"), href: "#services" },
      { name: t("navigation.contact"), href: "#contact" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "mailto:coach@fitcoach.com", label: "Email" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      scrollTo(href);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <motion.button
              onClick={() => scrollTo("home")}
              className="flex items-center gap-3 group mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/logo_image.svg"
                  alt="David Birger Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div className="relative h-7 w-40">
                <Image
                  src="/logo_title.svg"
                  alt="David Birger"
                  fill
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </motion.button>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              {t("tagline")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-2xl flex items-center justify-center transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-base font-semibold mb-6">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.href)}
                      className="text-gray-400 hover:text-white transition-colors inline-block text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 mb-16">
          <div className="md:flex items-center justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">
                {t("newsletter.title")}
              </h3>
              <p className="text-gray-400">{t("newsletter.description")}</p>
            </div>
            <div className="flex gap-3 min-w-[340px]">
              <input
                type="email"
                placeholder={t("newsletter.emailPlaceholder")}
                className="flex-1 px-5 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
              <button
                type="button"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl font-medium transition-all whitespace-nowrap"
              >
                {t("newsletter.subscribeButton")}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex gap-8 text-sm">
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("legal.privacyPolicy")}
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("legal.termsOfService")}
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("legal.cookiePolicy")}
            </button>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
