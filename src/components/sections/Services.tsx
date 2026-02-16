import {
  Apple,
  Calendar,
  Dumbbell,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/button";
import { CONTACT_FORM_HREF } from "@/constants/links";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface ServicesProps {
  isComingSoon?: boolean;
}

export async function Services({ isComingSoon = false }: ServicesProps) {
  const t = await getTranslations("services");

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
      className={cn(
        "relative overflow-hidden py-20 md:py-28",
        isComingSoon ? "bg-gray-100" : "bg-gray-50",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("tag")}
          title={t("title")}
          titleAccent={t("titleAccent")}
          description={t("description")}
          className="mb-20"
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {services.map((service) => (
            <div
              key={service.title}
              className={cn(
                "group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-500",
                isComingSoon
                  ? "opacity-65 saturate-0"
                  : "hover:border-gray-300",
              )}
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                {isComingSoon ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-gray-100 via-gray-50 to-gray-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/80">
                      <service.icon className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium uppercase tracking-[0.14em] text-gray-500">
                      {t("comingSoon")}
                    </p>
                  </div>
                ) : (
                  <>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </>
                )}
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

                {isComingSoon ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="w-full border-gray-300 bg-gray-100 text-gray-500"
                  >
                    {t("comingSoon")}
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Link href={CONTACT_FORM_HREF}>{t("learnMore")}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "rounded-3xl border border-gray-200 bg-white p-8 md:p-16",
            isComingSoon ? "opacity-70 saturate-0" : "",
          )}
        >
          <h3 className="text-3xl sm:text-4xl lg:text-5xl text-center mb-4 text-gray-900 tracking-tight">
            {t("process.title")}
          </h3>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
            {t("process.description")}
          </p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {processSteps.map((step, index) => (
              <div key={step.title} className="text-center relative">
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
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            {isComingSoon ? (
              <Button
                type="button"
                size="lg"
                disabled
                className="h-auto w-full max-w-full whitespace-normal break-words text-center leading-snug sm:w-auto"
              >
                {t("comingSoon")}
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="h-auto w-full max-w-full whitespace-normal break-words text-center leading-snug sm:w-auto shadow-lg hover:shadow-xl"
              >
                <Link href={CONTACT_FORM_HREF}>{t("process.cta")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
