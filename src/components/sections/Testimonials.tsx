import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { SectionHeader } from "@/components/sections/SectionHeader";

export async function Testimonials() {
  const t = await getTranslations("testimonials");
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
        <SectionHeader
          tag={t("tag")}
          title={t("title")}
          titleAccent={t("titleAccent")}
          description={
            t.has("description")
              ? t("description")
              : "Hear from clients who have transformed their lives through personalized coaching and dedication."
          }
          className="mb-20"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:border-gray-300 transition-all duration-500 group"
            >
              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-gray-400" />
              </div>

              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
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
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    sizes="48px"
                    className="h-full w-full object-cover"
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
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 max-w-5xl mx-auto">
          {[
            { number: "500+", label: t("stats.clients"), key: "clients" },
            { number: "98%", label: t("stats.success"), key: "success" },
            { number: "10K+", label: t("stats.workouts"), key: "workouts" },
            { number: "4.9/5", label: t("stats.rating"), key: "rating" },
          ].map((stat) => (
            <div
              key={stat.key}
              className="text-center p-8 bg-gray-50 border border-gray-200 rounded-3xl"
            >
              <div className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
