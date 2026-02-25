import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { CONTACT_FORM_HREF } from "@/constants/links";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");

  const stats = [
    { number: "300+", label: t("stats.clients"), key: "clients" },
    { number: "10+", label: t("stats.experience"), key: "experience" },
    { number: "98%", label: t("stats.success"), key: "success" },
  ];

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
          priority
          sizes="(min-width: 768px) 100vw"
          className="hidden object-cover object-right md:block [@media(min-width:768px)_and_(max-height:1420px)]:object-contain [@media(min-width:768px)_and_(max-height:1420px)]:object-right"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/35 to-black/75" />
        <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-black/45 lg:from-black/75 lg:via-black/30 lg:to-black/35" />
      </div>

      <div className="container relative z-10 mx-auto min-h-svh px-4 pb-24 sm:px-6 sm:pb-20 md:max-h-[1420px] lg:px-8">
        <div
          className={cn(
            "mx-auto mt-[34vh] text-center sm:mt-[42vh] md:mx-0 md:mt-[24vh] md:text-left lg:mt-[22vh]",
            locale === "ua"
              ? "max-w-5xl md:max-w-4xl"
              : "max-w-4xl md:max-w-3xl",
          )}
        >
          <div className="mb-3 mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white backdrop-blur-md sm:mb-4 sm:text-sm md:mx-0">
            {t("badge")}
          </div>

          <h1
            className={cn(
              "font-ermilov mb-4 mx-auto flex w-full flex-col items-center text-center leading-[0.95] tracking-tight text-white sm:mb-5 md:mx-0 md:items-start md:text-left",
              locale === "ua"
                ? "text-2xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-5xl 2xl:text-6xl [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-[2.25rem] [@media(min-width:1200px)_and_(max-height:800px)]:text-4xl"
                : "text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-5xl 2xl:text-6xl [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-[2.25rem] [@media(min-width:1200px)_and_(max-height:800px)]:text-4xl",
            )}
          >
            <span className="block whitespace-nowrap">{t("titleLine1")}</span>
            <span className="block whitespace-nowrap">{t("titleLine2")}</span>
          </h1>

          <p className="mb-5 mx-auto max-w-none px-2 text-base leading-snug text-white/80 sm:mb-7 sm:max-w-2xl sm:px-0 sm:text-lg sm:leading-relaxed md:mx-0 md:max-w-xl md:text-sm md:leading-relaxed md:text-left lg:max-w-2xl lg:text-lg [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-xs [@media(min-width:1200px)_and_(max-height:800px)]:text-base">
            {t("subtitle")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 text-gray-950 shadow-lg hover:bg-yellow-300 hover:shadow-xl"
            >
              <Link href={CONTACT_FORM_HREF}>
                {t("ctaText")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:mt-16 sm:gap-6 md:mx-0 md:mt-10 md:max-w-xl md:gap-3 lg:mt-16 lg:max-w-2xl lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-md sm:p-6 md:p-3.5 lg:p-6"
              >
                <div className="mb-1 text-3xl font-semibold text-white sm:text-4xl md:text-3xl lg:text-5xl [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-3xl [@media(min-width:1200px)_and_(max-height:800px)]:text-4xl">
                  {stat.number}
                </div>
                <div className="text-sm text-white/70 md:text-xs lg:text-sm [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-[11px] [@media(min-width:1200px)_and_(max-height:800px)]:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl px-2 text-sm font-medium tracking-wide text-white/85 sm:px-0 sm:text-base md:mx-0 md:max-w-xl md:text-sm md:text-left lg:max-w-2xl lg:text-base [@media(min-width:1024px)_and_(max-width:1199px)_and_(max-height:800px)]:text-xs [@media(min-width:1200px)_and_(max-height:800px)]:text-sm">
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
