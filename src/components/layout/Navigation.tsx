import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LanguageSwitcherClient } from "@/components/layout/LanguageSwitcherClient";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";

export async function Navigation({ locale }: { locale: Locale }) {
  const t = await getTranslations("navigation");
  const tJourney = await getTranslations("journey");
  const tTestimonials = await getTranslations("testimonials");
  const tCTA = await getTranslations("cta");

  const menuItems = [
    { name: t("home"), href: "/#home" },
    { name: t("about"), href: "/about" },
    { name: t("services"), href: "/services" },
    { name: t("contact"), href: "/contact" },
  ];

  const breadcrumbSections = [
    { id: "home", label: t("home") },
    { id: "journey", label: tJourney("tag") },
    { id: "about", label: t("about") },
    { id: "testimonials", label: tTestimonials("tag") },
    { id: "cta", label: tCTA("tag") },
  ];

  return (
    <header
      id="site-header"
      className="group fixed top-0 left-0 right-0 z-40 border-b border-gray-200/70 bg-white shadow-[0_8px_30px_-24px_rgba(15,23,42,0.55)] data-[mobile-collapsed=true]:border-transparent data-[mobile-collapsed=true]:bg-transparent data-[mobile-collapsed=true]:shadow-none"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:hidden">
          <Link
            href="/#home"
            className="flex items-center gap-0.5 transition-opacity duration-200 hover:opacity-90 group-data-[mobile-collapsed=true]:opacity-0 group-data-[mobile-collapsed=true]:pointer-events-none"
            aria-label="Home"
          >
            <div className="relative h-16 w-16">
              <Image
                src="/logo_image.svg"
                alt="David Birger Logo"
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </div>
            <div className="relative h-6 w-32">
              <Image
                src="/logo_title.svg"
                alt="David Birger"
                fill
                sizes="128px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <MobileSidebar
            headerId="site-header"
            locale={locale}
            ctaText={t("ctaText")}
            items={menuItems}
            sections={breadcrumbSections}
          />
        </div>

        <div className="hidden h-20 items-center justify-between md:flex">
          <Link
            href="/#home"
            className="flex items-center gap-0.5 transition-opacity duration-200 hover:opacity-90"
            aria-label="Home"
          >
            <div className="relative h-20 w-20">
              <Image
                src="/logo_image.svg"
                alt="David Birger Logo"
                fill
                sizes="80px"
                className="object-contain"
                priority
              />
            </div>
            <div className="relative h-7 w-40">
              <Image
                src="/logo_title.svg"
                alt="David Birger"
                fill
                sizes="160px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group/nav relative text-sm font-semibold tracking-wide text-gray-800 transition-colors hover:text-gray-950"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-gray-900 transition-all duration-300 group-hover/nav:w-full" />
              </Link>
            ))}
            <LanguageSwitcherClient currentLocale={locale} />
            <Button asChild className="px-6">
              <Link href="/contact">{t("ctaText")}</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
