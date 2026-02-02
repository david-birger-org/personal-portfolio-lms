"use client";

import { motion } from "framer-motion";
import {
  Apple,
  Calendar,
  Dumbbell,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Services() {
  const t = useTranslations("services");
  const scrollTo = useSectionScroll();

  const serviceItems = t.raw("items") as Array<{
    title: string;
    description: string;
    features: string[];
  }>;

  const services = [
    {
      icon: Dumbbell,
      ...serviceItems[0],
      image:
        "https://images.unsplash.com/photo-1758875569414-120ebc62ada3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluaW5nJTIwc2Vzc2lvbiUyMGd5bXxlbnwxfHx8fDE3Njk3MDUzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Users,
      ...serviceItems[1],
      image:
        "https://images.unsplash.com/photo-1758274539089-8b2bd10eee92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhbnNmb3JtYXRpb24lMjB3b3Jrb3V0fGVufDF8fHx8MTc2OTcwNTMwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Apple,
      ...serviceItems[2],
      image:
        "https://images.unsplash.com/photo-1587996580981-bd03dde74843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5YnVpbGRpbmclMjBudXRyaXRpb24lMjBtZWFsJTIwcHJlcHxlbnwxfHx8fDE3Njk3MDUzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Target,
      ...serviceItems[3],
      image:
        "https://images.unsplash.com/photo-1641134148191-f90cd3dede13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBib2R5YnVpbGRlciUyMGd5bSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTcwNTMwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const processStepsData = t.raw("process.steps") as Array<{
    title: string;
    description: string;
  }>;

  const processSteps = [
    {
      icon: Calendar,
      ...processStepsData[0],
    },
    {
      icon: Target,
      ...processStepsData[1],
    },
    {
      icon: TrendingUp,
      ...processStepsData[2],
    },
  ];

  return (
    <section
      id="services"
      className="py-32 md:py-40 bg-gray-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span
            variants={fadeInUp}
            className="text-gray-600 font-medium text-sm uppercase tracking-wider"
          >
            {t("tag")}
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl mt-4 mb-6 text-gray-900 tracking-tight"
          >
            {t("title")}
            <br />
            <span className="text-gray-500">{t("titleAccent")}</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-600 leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{
                delay: index * 0.1,
              }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3">
                  <service.icon className="w-6 h-6 text-gray-900" />
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <div className="w-1 h-1 bg-gray-900 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className="w-full border border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-900 rounded-full transition-all"
                  onClick={() => scrollTo("contact")}
                >
                  {t("learnMore")}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="bg-white border border-gray-200 rounded-3xl p-8 md:p-16"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl text-center mb-4 text-gray-900 tracking-tight"
          >
            {t("process.title")}
          </motion.h3>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 text-center mb-16 max-w-2xl mx-auto leading-relaxed"
          >
            {t("process.description")}
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                className="text-center relative"
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gray-200" />
                )}

                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-3xl mb-6">
                  <step.icon className="w-9 h-9 text-white" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="text-center mt-16">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-xl"
              onClick={() => scrollTo("contact")}
            >
              {t("process.cta")}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
