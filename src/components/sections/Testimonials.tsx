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
      className="py-20 md:py-24 bg-white relative overflow-hidden"
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

        <div className="mx-auto mb-12 max-w-5xl rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center sm:p-8">
          <div className="text-sm font-semibold tracking-wide text-gray-600 uppercase">
            {t("stats.rating")}
          </div>
          <div className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            4.9/5
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {[
              "rating-star-1",
              "rating-star-2",
              "rating-star-3",
              "rating-star-4",
              "rating-star-5",
            ].map((key) => (
              <Star key={key} className="w-5 h-5 fill-gray-900 text-gray-900" />
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-600">{t("description")}</p>
        </div>

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
      </div>
    </section>
  );
}
