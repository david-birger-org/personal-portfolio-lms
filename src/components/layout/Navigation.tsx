"use client";

import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSectionScroll } from "@/hooks/useSectionScroll";

export function Navigation() {
  const t = useTranslations("navigation");
  const scrollTo = useSectionScroll();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [hideLogo, setHideLogo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const mobileHideLogo = isMobile && hideLogo;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !scrolled) {
      setScrolled(true);
    } else if (latest <= 50 && scrolled) {
      setScrolled(false);
    }

    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 0;
    setHideLogo((prev) => {
      const next = latest > viewportHeight;
      return prev === next ? prev : next;
    });
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const menuItems = [
    { name: t("home"), href: "#home" },
    { name: t("about"), href: "#about" },
    { name: t("services"), href: "#services" },
    { name: t("contact"), href: "#contact" },
  ];

  return (
    <>
      <LayoutGroup>
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
            mobileHideLogo
              ? "bg-transparent backdrop-blur-none border-transparent shadow-none"
              : scrolled
                ? "bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-lg shadow-black/5"
                : "bg-white/40 backdrop-blur-sm"
          }`}
        >
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <motion.button
                onClick={() => scrollTo("home")}
                className={`flex items-center gap-3 group transition-opacity duration-300 ${
                  mobileHideLogo
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-8 h-8 md:w-10 md:h-10">
                  <Image
                    src="/logo_image.svg"
                    alt="David Birger Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative h-6 md:h-7 w-32 md:w-40">
                  <Image
                    src="/logo_title.svg"
                    alt="David Birger"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </motion.button>

              <div className="hidden md:flex items-center gap-8">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollTo(item.href)}
                    className="text-gray-900 hover:text-black transition-colors text-sm font-semibold relative group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full" />
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <LanguageSwitcher />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="button"
                    onClick={() => scrollTo("contact")}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 rounded-full transition-all"
                  >
                    {t("ctaText")}
                  </Button>
                </motion.div>
              </div>

              <motion.button
                layout
                layoutId="mobile-menu-trigger"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 text-gray-700 hover:text-gray-900 transition-opacity duration-200 ${
                  mobileHideLogo
                    ? "pointer-events-none opacity-0"
                    : "pointer-events-auto opacity-100"
                }`}
                aria-label="Toggle menu"
                animate={{
                  rotate: mobileMenuOpen ? 90 : 0,
                  scale: mobileMenuOpen ? 1.04 : 1,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                whileTap={{ scale: 0.94 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </nav>
        </motion.header>

        <AnimatePresence>
          {mobileHideLogo && (
            <motion.button
              layout
              layoutId="mobile-menu-trigger"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="fixed top-4 right-4 z-50 rounded-full border border-white/30 bg-white/70 p-2 text-gray-700 shadow-lg shadow-black/5 backdrop-blur-2xl transition-colors hover:text-gray-900 md:hidden"
              aria-label="Toggle menu"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                scale: mobileMenuOpen ? 1.04 : 1,
                rotate: mobileMenuOpen ? 90 : 0,
              }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              whileTap={{ scale: 0.94 }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </LayoutGroup>

      <AnimatePresence initial={false} mode="wait">
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-64 transform-gpu bg-white/70 backdrop-blur-2xl shadow-lg shadow-black/5 z-30 md:hidden border-l border-white/20 will-change-transform"
            >
              <div className="flex h-full flex-col gap-4 p-6 pt-20">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollTo(item.href);
                    }}
                    className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium text-left"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo("contact");
                  }}
                  className="bg-gray-900 hover:bg-gray-800 text-white mt-4 rounded-full"
                >
                  {t("ctaText")}
                </Button>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.length * 0.1 }}
                  className="mt-auto pt-4"
                >
                  <LanguageSwitcher onSelect={() => setMobileMenuOpen(false)} />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
