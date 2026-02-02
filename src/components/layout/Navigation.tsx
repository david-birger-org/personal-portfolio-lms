"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSectionScroll } from "@/hooks/useSectionScroll";

export function Navigation() {
  const t = useTranslations("navigation");
  const scrollTo = useSectionScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !scrolled) {
      setScrolled(true);
    } else if (latest <= 50 && scrolled) {
      setScrolled(false);
    }
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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-lg shadow-black/5"
            : "bg-white/40 backdrop-blur-sm"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.button
              onClick={() => scrollTo("home")}
              className="flex items-center gap-3 group"
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 w-64 bg-white/90 backdrop-blur-2xl shadow-2xl z-30 md:hidden border-l border-gray-200/50"
            >
              <div className="flex flex-col p-6 gap-4">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
