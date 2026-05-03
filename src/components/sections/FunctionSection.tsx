"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "../../data/animations";
import { serviceFunctions } from "../../data/siteData";

export function FunctionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="functions"
      ref={ref}
      className="py-20 md:py-32 lg:py-40 px-6 md:px-10 lg:px-24 bg-white text-black"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        {/* Startup Architecture (Main) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="md:border-r md:border-gray-100 md:pr-24"
        >
          <span className="bg-[#0057FF] text-white px-3 py-1 rounded-full font-mono tracking-widest uppercase text-[10px] md:text-xs mb-4 inline-block">
            {serviceFunctions.startup.mainLabel}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mt-4 mb-8 tracking-tighter">
            {serviceFunctions.startup.title}
          </h2>
          <p className="text-gray-600 text-lg md:text-2xl mb-12 md:mb-20 leading-snug">
            {serviceFunctions.startup.desc}
          </p>
          <ul className="space-y-6">
            {serviceFunctions.startup.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-4 text-base md:text-xl font-medium">
                <span className="w-2 h-2 bg-[#0057FF] rounded-full mt-2.5" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* AI Mind Design (Research) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1}
          className="flex flex-col justify-center"
        >
          <span className="border border-[#FF3B30] text-[#FF3B30] px-3 py-1 rounded-full font-mono tracking-widest uppercase text-[10px] md:text-xs mb-4 inline-block w-fit">
            {serviceFunctions.ai.mainLabel}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6 tracking-tighter text-gray-400">
            {serviceFunctions.ai.title}
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-10 md:mb-16">
            {serviceFunctions.ai.desc}
          </p>
          <ul className="grid grid-cols-1 gap-4">
            {serviceFunctions.ai.features.map((feature, i) => (
              <li key={i} className="bg-gray-50 p-5 rounded-2xl text-sm md:text-base text-gray-600 border border-gray-100">
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
