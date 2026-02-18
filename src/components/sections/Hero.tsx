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
      className="relative flex min-h-[min(calc(100svh-4rem),1792px)] items-start justify-center overflow-x-hidden sm:min-h-[min(calc(100svh-5rem),1792px)]"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-1.jpg"
          alt="Fitness Training"
          fill
          priority
          sizes="100vw"
          style={{ maxHeight: "1792px" }}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="container relative z-10 mx-auto min-h-[min(calc(100svh-4rem),1792px)] px-4 pb-24 sm:min-h-[min(calc(100svh-5rem),1792px)] sm:px-6 sm:pb-20 lg:px-8">
        <div
          className={cn(
            "mx-auto mt-[36vh] text-center sm:mt-[44vh]",
            locale === "ua" ? "max-w-5xl" : "max-w-4xl",
          )}
        >
          <div className="mb-3 mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white backdrop-blur-md sm:mb-4 sm:text-sm">
            {t("badge")}
          </div>

          <h1
            className={cn(
              "font-ermilov mb-4 mx-auto flex w-full flex-col items-center text-center text-white tracking-tight leading-[0.95] sm:mb-5",
              locale === "ua"
                ? "text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl"
                : "text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl",
            )}
          >
            <span className="block whitespace-nowrap">{t("titleLine1")}</span>
            <span className="block whitespace-nowrap">{t("titleLine2")}</span>
          </h1>

          <p className="mb-5 mx-auto max-w-none px-2 text-lg leading-snug text-white/80 sm:mb-7 sm:max-w-2xl sm:px-0 sm:text-xl sm:leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 shadow-lg hover:bg-gray-100 hover:shadow-xl"
            >
              <Link href={CONTACT_FORM_HREF}>
                {t("ctaText")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 max-w-3xl mx-auto sm:mt-16 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
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
