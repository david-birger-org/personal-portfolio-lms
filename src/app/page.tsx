"use client";

import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gray-900 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}
