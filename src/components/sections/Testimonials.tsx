"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const testimonials = t.raw("items") as Array<{
    name: string;
    role: string;
    content: string;
    image: string;
    rating: number;
    transformation?: string;
  }>;

  return (
    <section
      id="testimonials"
      className="py-32 md:py-40 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            {t.has("description")
              ? t("description")
              : "Hear from clients who have transformed their lives through personalized coaching and dedication."}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{
                delay: index * 0.1,
              }}
              className="bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:border-gray-300 transition-all duration-500 group"
            >
              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-gray-400" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={`${testimonial.name}-star-${i}`}
                    className="w-4 h-4 fill-gray-900 text-gray-900"
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {testimonial.transformation && (
                <div className="mb-6 inline-block">
                  <span className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-900">
                    {testimonial.transformation}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <div className="w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-gray-200">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 max-w-5xl mx-auto"
        >
          {[
            { number: "500+", label: t("stats.clients"), key: "clients" },
            { number: "98%", label: t("stats.success"), key: "success" },
            { number: "10K+", label: t("stats.workouts"), key: "workouts" },
            { number: "4.9/5", label: t("stats.rating"), key: "rating" },
          ].map((stat) => (
            <motion.div
              key={stat.key}
              variants={fadeInUp}
              className="text-center p-8 bg-gray-50 border border-gray-200 rounded-3xl"
            >
              <div className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
