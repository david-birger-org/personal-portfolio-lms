"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { itemFadeInUp, scaleIn, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const scrollTo = useSectionScroll();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
      <motion.div
        className="inset-0 absolute"
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        style={{ willChange: "transform, opacity" }}
      >
        <motion.div
          style={{ scale, willChange: "transform" }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1591311630200-ffa9120a540f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjB3ZWlnaHRzJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzY5NjkxNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fitness Training"
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={itemFadeInUp}
            className="inline-block mb-5 sm:mb-6"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-medium">
              {t("badge")}
            </div>
          </motion.div>

          <motion.h1
            variants={itemFadeInUp}
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
          </motion.h1>

          <motion.p
            variants={itemFadeInUp}
            className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={itemFadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-xl"
              onClick={() => scrollTo("contact")}
            >
              {t("ctaText")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div
            variants={itemFadeInUp}
            className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + stats.indexOf(stat) * 0.08,
                  duration: 0.45,
                }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
