import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/button";
import { CONTACT_FORM_HREF } from "@/constants/links";
import { Link } from "@/i18n/routing";

export async function CTA() {
  const t = await getTranslations("cta");
  const features = t.raw("features") as string[];

  return (
    <section
      id="cta"
      className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <SectionHeader
              tag={t("tag")}
              title={t("title")}
              titleAccent={t("titleAccent")}
              description={t("description")}
              align="left"
              className="mb-8"
              titleClassName="mb-0"
              descriptionClassName="mb-0"
            />

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={feature} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature}
                    </h3>
                    <p className="text-gray-600">
                      {t(`featureDescriptions.${index}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl">
                <Link href={CONTACT_FORM_HREF}>
                  {t("button")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/promo-image.jpg"
                alt="Transform Your Body - David Birger"
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-30" />
    </section>
  );
}
