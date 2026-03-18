import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonVariants } from "@/components/ui/button";
import { SERVICES_SECTION_HREF } from "@/constants/links";
import { cn } from "@/lib/utils";

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");

  return (
    <section
      id="home"
      className="relative flex min-h-svh items-start justify-center overflow-x-hidden md:max-h-[1420px]"
    >
      <div className="absolute inset-0 bg-black">
        <Image
          src="/images/hero-1-mobile.jpg"
          alt="Fitness Training"
          fill
          priority
          sizes="(max-width: 767px) 100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/images/hero-1-desk.jpg"
          alt="Fitness Training"
          fill
          sizes="(min-width: 768px) 100vw"
          className="hidden object-contain object-right md:block"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/35 to-black/75" />
        <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-black/45 lg:from-black/75 lg:via-black/30 lg:to-black/35" />
      </div>

      <div className="container relative z-10 mx-auto min-h-svh px-4 pb-16 sm:px-6 sm:pb-14 md:max-h-[1420px] lg:px-8">
        <div
          className={cn(
            "mt-[39vh] text-center sm:mt-[45vh] md:mt-[20vh] md:flex md:min-h-[52svh] md:flex-col md:justify-center md:gap-6 md:text-left",
            locale === "ua"
              ? "max-w-5xl md:max-w-4xl"
              : "max-w-4xl md:max-w-3xl",
          )}
        >
          <div>
            <div className="mb-3 mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white backdrop-blur-md sm:mb-4 sm:text-sm md:mx-0">
              {t("badge")}
            </div>

            <h1
              className={cn(
                "font-ermilov mb-4 flex w-full flex-col items-center text-center leading-[0.95] tracking-tight text-white sm:mb-5 md:items-start md:text-left",
                locale === "ua"
                  ? "text-2xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-5xl 2xl:text-6xl [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-[2.25rem] [@media(min-width:1200px)_and_(max-height:800px)]:text-4xl"
                  : "text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-5xl 2xl:text-6xl [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-[2.25rem] [@media(min-width:1200px)_and_(max-height:800px)]:text-4xl",
              )}
            >
              <span className="block whitespace-nowrap">{t("titleLine1")}</span>
              <span className="block whitespace-nowrap">{t("titleLine2")}</span>
            </h1>

            <p className="mb-5 max-w-none px-2 text-base leading-snug text-white/80 sm:mb-7 sm:max-w-2xl sm:px-0 sm:text-lg sm:leading-relaxed md:max-w-xl md:text-sm md:leading-relaxed lg:max-w-2xl lg:text-lg [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-xs [@media(min-width:1200px)_and_(max-height:800px)]:text-base">
              {t("subtitle")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:items-start md:justify-start">
              <TrackedLink
                href={SERVICES_SECTION_HREF}
                analyticsId="hero_services"
                analyticsSection="hero"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "border border-white/65 bg-white/20 text-white shadow-[0_14px_36px_-18px_rgba(2,6,23,0.8)] backdrop-blur-md hover:bg-white/30 hover:shadow-[0_18px_44px_-20px_rgba(2,6,23,0.85)]",
                })}
              >
                {t("ctaText")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </TrackedLink>
            </div>
          </div>

          <p className="mt-6 max-w-2xl px-2 text-sm font-medium tracking-wide text-white/85 sm:px-0 sm:text-base md:mt-0 md:max-w-xl md:text-sm lg:max-w-2xl lg:text-base [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-xs [@media(min-width:1200px)_and_(max-height:800px)]:text-sm">
            {t("motivation")}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
