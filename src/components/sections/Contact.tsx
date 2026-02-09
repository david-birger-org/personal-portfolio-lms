"use client";

import {
  AsYouType,
  type CountryCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import {
  CheckCircle2,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const CONTACT_COUNTRIES = [
  { code: "UA", dialCode: "+380", labelKey: "ua" },
  { code: "US", dialCode: "+1", labelKey: "us" },
  { code: "PL", dialCode: "+48", labelKey: "pl" },
  { code: "DE", dialCode: "+49", labelKey: "de" },
] as const;

const SOCIAL_HANDLE_PATTERN = /^@?[a-zA-Z0-9._]{2,32}$/;

export function Contact() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "UA" as CountryCode,
    phone: "",
    preferredContactMethod: "",
    social: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("form.validation.firstNameRequired");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("form.validation.lastNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("form.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("form.validation.emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("form.validation.phoneRequired");
    } else if (
      !parsePhoneNumberFromString(formData.phone, formData.country)?.isValid()
    ) {
      newErrors.phone = t("form.validation.phoneInvalid");
    }

    if (!formData.preferredContactMethod.trim()) {
      newErrors.preferredContactMethod = t(
        "form.validation.preferredContactMethodRequired",
      );
    }

    if (
      ["instagram", "telegram"].includes(formData.preferredContactMethod) &&
      !formData.social.trim()
    ) {
      newErrors.social = t("form.validation.socialRequired");
    } else if (
      formData.social.trim() &&
      !SOCIAL_HANDLE_PATTERN.test(formData.social.trim())
    ) {
      newErrors.social = t("form.validation.socialInvalid");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("form.validation.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("form.validation.messageMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      country: "UA",
      phone: "",
      preferredContactMethod: "",
      social: "",
      message: "",
    });

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePreferredContactMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredContactMethod: value }));
    if (errors.preferredContactMethod) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.preferredContactMethod;
        return newErrors;
      });
    }
  };

  const handleCountryChange = (value: string) => {
    const country = value as CountryCode;

    setFormData((prev) => ({
      ...prev,
      country,
      phone: prev.phone
        ? new AsYouType(country).input(prev.phone.replace(/[^\d+]/g, ""))
        : "",
    }));

    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = new AsYouType(formData.country).input(
      rawValue.replace(/[^\d+]/g, ""),
    );

    setFormData((prev) => ({ ...prev, phone: formattedValue }));

    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("info.email.title"),
      value: t("info.email.value"),
      link: `mailto:${t("info.email.value")}`,
      key: "email",
    },
    {
      icon: Phone,
      title: t("info.phone.title"),
      value: t("info.phone.value"),
      link: `tel:${t("info.phone.value").replace(/\s/g, "")}`,
      key: "phone",
    },
    {
      icon: MapPin,
      title: t("info.location.title"),
      value: t("info.location.value"),
      link: null,
      key: "location",
    },
  ];

  return (
    <section
      id="contact"
      className="py-32 md:py-40 bg-gray-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
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

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="flex h-full flex-col"
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <h3 className="text-2xl sm:text-3xl mb-4 text-gray-900 tracking-tight">
                {t("info.infoTitle")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("info.infoDescription")}
              </p>
            </motion.div>

            <div className="space-y-6 mb-10">
              {contactInfo.map((info) => (
                <motion.div
                  key={info.key}
                  variants={fadeInUp}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      {info.title}
                    </div>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">
                        {info.value}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp} className="mb-10">
              <h4 className="text-sm text-gray-600 mb-4 font-medium">
                {t("socials.title")}
              </h4>
              <div className="flex gap-3">
                <motion.a
                  href={t("socials.instagram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6 text-[#E4405F] group-hover:text-[#C13584] transition-colors" />
                </motion.a>
                <motion.a
                  href={t("socials.facebook")}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6 text-[#1877F2] group-hover:text-[#0C5DC6] transition-colors" />
                </motion.a>
                <motion.a
                  href={t("socials.telegram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow group"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5 text-[#0088cc] group-hover:text-[#006699] transition-colors" />
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-auto bg-white border border-gray-200 rounded-3xl p-8"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">
                {t("consultation.title")}
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {t("consultation.description")}
              </p>
              <div className="flex flex-wrap gap-2">
                {(t.raw("consultation.features") as string[]).map((feature) => (
                  <span
                    key={feature}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            className="bg-white rounded-3xl border border-gray-200 p-8 lg:p-10"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {t("form.success.title")}
                </h3>
                <p className="text-gray-600">{t("form.success.description")}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-gray-900 mb-2 block"
                    >
                      {t("form.firstNameLabel")}
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`border-gray-300 rounded-2xl ${errors.firstName ? "border-red-500" : ""}`}
                      placeholder={t("form.firstNamePlaceholder")}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-gray-900 mb-2 block"
                    >
                      {t("form.lastNameLabel")}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`border-gray-300 rounded-2xl ${errors.lastName ? "border-red-500" : ""}`}
                      placeholder={t("form.lastNamePlaceholder")}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-900 mb-2 block">
                    {t("form.emailLabel")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`border-gray-300 rounded-2xl ${errors.email ? "border-red-500" : ""}`}
                    placeholder={t("form.emailPlaceholder")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-2">{errors.email}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-gray-900 mb-2 block">
                      {t("form.countryLabel")}
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={handleCountryChange}
                    >
                      <SelectTrigger className="border-gray-300 rounded-2xl">
                        <SelectValue
                          placeholder={t("form.countryPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT_COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {`${t(`form.countries.${country.labelKey}`)} (${country.dialCode})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-900 mb-2 block">
                      {t("form.phoneLabel")}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`border-gray-300 rounded-2xl ${errors.phone ? "border-red-500" : ""}`}
                      placeholder={t("form.phonePlaceholder", {
                        countryCode:
                          CONTACT_COUNTRIES.find(
                            (country) => country.code === formData.country,
                          )?.dialCode ?? "+380",
                      })}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900 mb-2 block">
                    {t("form.preferredContactMethodLabel")}
                  </Label>
                  <Select
                    value={formData.preferredContactMethod}
                    onValueChange={handlePreferredContactMethodChange}
                  >
                    <SelectTrigger
                      className={`border-gray-300 rounded-2xl ${
                        errors.preferredContactMethod ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={t(
                          "form.preferredContactMethodPlaceholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">
                        {t("form.contactMethods.sms")}
                      </SelectItem>
                      <SelectItem value="instagram">
                        {t("form.contactMethods.instagram")}
                      </SelectItem>
                      <SelectItem value="telegram">
                        {t("form.contactMethods.telegram")}
                      </SelectItem>
                      <SelectItem value="phoneCall">
                        {t("form.contactMethods.phoneCall")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferredContactMethod && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.preferredContactMethod}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="social" className="text-gray-900 mb-2 block">
                    {t("form.socialLabel")}
                  </Label>
                  <Input
                    id="social"
                    name="social"
                    type="text"
                    value={formData.social}
                    onChange={handleChange}
                    className={`border-gray-300 rounded-2xl ${errors.social ? "border-red-500" : ""}`}
                    placeholder={t("form.socialPlaceholder")}
                  />
                  {errors.social && (
                    <p className="text-sm text-red-600 mt-2">{errors.social}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-900 mb-2 block">
                    {t("form.messageLabel")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`min-h-[150px] border-gray-300 rounded-2xl ${
                      errors.message ? "border-red-500" : ""
                    }`}
                    placeholder={t("form.messagePlaceholder")}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-base rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    <>
                      {t("form.submitButton")}
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
