import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
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
      className="relative min-h-screen min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-24 sm:pt-28 sm:pb-28"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1591311630200-ffa9120a540f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjB3ZWlnaHRzJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzY5NjkxNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Fitness Training"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-5 sm:mb-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-medium">
              {t("badge")}
            </div>
          </div>

          <h1
            className={cn(
              "font-ermilov mb-6 text-white tracking-tight",
              locale === "ua"
                ? "text-4xl sm:text-6xl lg:text-7xl xl:text-8xl"
                : "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl",
            )}
          >
            <span className="block">{t("titleLine1")}</span>
            <span className="block">{t("titleLine2")}</span>
            <span className="block">{t("titleLine3")}</span>
            <span className="block">{t("titleLine4")}</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 shadow-lg hover:bg-gray-100 hover:shadow-xl"
            >
              <Link href="/#contact">
                {t("ctaText")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-16 max-w-3xl mx-auto">
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
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
