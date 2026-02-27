import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  ServiceDialogManager,
  type ServiceItem,
} from "@/components/sections/ServiceCardDialog";
import { cn } from "@/lib/utils";

const productCards = [
  {
    src: "/images/product-1.jpg",
    imageClassName: "object-cover object-top",
  },
  {
    src: "/images/product-2.jpg",
    imageClassName: "object-cover object-top",
  },
  {
    src: "/images/product-3.jpg",
    imageClassName: "object-cover object-top md:object-top",
  },
  {
    src: "/images/product-4.jpg",
    imageClassName: "object-cover object-[center_25%] md:object-[center_15%]",
  },
  {
    src: "/images/product-5.jpg",
    imageClassName: "object-cover object-[center_53%] md:object-[center_25%]",
  },
] as const;

function getPreview(description: string) {
  const firstPart = description.split(/[.!?]/)[0]?.trim();

  if (!firstPart) {
    return description;
  }

  return `${firstPart}.`;
}

export async function Services() {
  const t = await getTranslations("services");
  const items = t.raw("items") as ServiceItem[];
  const learnMoreLabel = t("learnMore");
  const dialogLabels = {
    includesLabel: t("includesLabel"),
    forWhoLabel: t("forWhoLabel"),
    inquiryTitle: t("inquiry.title"),
    nameLabel: t("inquiry.nameLabel"),
    namePlaceholder: t("inquiry.namePlaceholder"),
    emailLabel: t("inquiry.emailLabel"),
    emailPlaceholder: t("inquiry.emailPlaceholder"),
    phoneLabel: t("inquiry.phoneLabel"),
    phonePlaceholder: t("inquiry.phonePlaceholder"),
    sendButton: t("inquiry.sendButton"),
    sendingButton: t("inquiry.sendingButton"),
    successMessage: t("inquiry.successMessage"),
    errorMessage: t("inquiry.errorMessage"),
    invalidEmailMessage: t("inquiry.invalidEmailMessage"),
    invalidPhoneMessage: t("inquiry.invalidPhoneMessage"),
    atLeastOneContactMessage: t("inquiry.atLeastOneContactMessage"),
  };

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

        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 md:gap-6">
          {items.map((item, index) => {
            const productCard = productCards[index % productCards.length];
            const cardKey = item.title.slice(0, 40);

            return (
              <button
                key={cardKey}
                type="button"
                data-service-index={index}
                className={cn(
                  "w-full cursor-pointer rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_15px_40px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_20px_48px_-28px_rgba(15,23,42,0.4)] focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none md:p-6",
                )}
              >
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <Image
                    src={productCard.src}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={productCard.imageClassName}
                  />
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {getPreview(item.description)}
                </p>

                <div className="mt-5">
                  <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">
                    {learnMoreLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <ServiceDialogManager items={items} labels={dialogLabels} />
      </div>
    </section>
  );
}
