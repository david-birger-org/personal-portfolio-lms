"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionTag from "@/components/ui/SectionTag";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Journey() {
  const t = useTranslations("journey");
  const cards = t.raw("cards") as Array<{ title: string; description: string }>;

  return (
    <section
      id="journey"
      className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div variants={fadeInUp}>
            <SectionTag>{t("tag")}</SectionTag>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4 tracking-tight"
          >
            {t("title")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {t("titleAccent")}
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {cards.map((card) => (
            <motion.div key={card.title} variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
