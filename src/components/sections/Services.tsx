import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/button";
import { CONTACT_FORM_HREF } from "@/constants/links";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
export async function Services() {
  const t = await getTranslations("services");
  const services = [
    "/images/coworking-1.jpg",
    "/images/coworking-2.jpg",
    "/images/coworking-3.jpg",
    "/images/coworking-4.jpg",
    "/images/coworking-5.jpg",
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gray-50 py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("tag")}
          title={t("title")}
          titleAccent={t("titleAccent")}
          description={t("description")}
          className="mb-12 md:mb-16"
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {services.map((image, index) => (
            <div
              key={image}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-gray-200 bg-black lg:col-span-2",
                index === 3 && "lg:col-start-2",
                index === 4 && "lg:col-start-4",
              )}
            >
              <div className="relative aspect-[4/5] bg-[#050a26]">
                <Image
                  src={image}
                  alt={`${t("title")} ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35 group-focus-within:bg-black/35" />

                <div className="absolute inset-x-4 bottom-4 opacity-100 transition duration-300 md:pointer-events-none md:translate-y-2 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                  <Button
                    asChild
                    size="sm"
                    className="w-full border border-white/80 bg-white/90 text-slate-900 shadow-lg backdrop-blur-xs hover:bg-white"
                  >
                    <Link href={CONTACT_FORM_HREF}>{t("learnMore")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
