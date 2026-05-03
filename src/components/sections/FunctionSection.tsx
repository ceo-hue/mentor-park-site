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
      className="py-24 md:py-48 lg:py-64 px-6 md:px-10 lg:px-24 bg-white text-black"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Startup Architecture (Main) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="lg:col-span-7 md:border-r md:border-gray-100 md:pr-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#0057FF] text-white px-4 py-1.5 rounded-full font-mono font-bold tracking-widest uppercase text-[10px] md:text-xs">
              {serviceFunctions.startup.mainLabel}
            </span>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-black mb-10 tracking-tighter leading-[0.9]">
            {serviceFunctions.startup.title}
          </h2>
          <p className="text-gray-600 text-xl md:text-3xl mb-16 md:mb-24 leading-snug font-medium max-w-2xl">
            {serviceFunctions.startup.desc}
          </p>
          
          <ul className="space-y-8">
            {serviceFunctions.startup.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-6 group">
                <span className="text-[#0057FF] font-mono font-bold text-lg md:text-xl mt-1">0{i+1}</span>
                <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-800 group-hover:text-[#0057FF] transition-colors duration-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Project ARHA (Research) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1}
          className="lg:col-span-5 flex flex-col justify-start pt-12 lg:pt-0"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="border-2 border-[#FF3B30] text-[#FF3B30] px-4 py-1.5 rounded-full font-mono font-bold tracking-widest uppercase text-[10px] md:text-xs">
              {serviceFunctions.ai.mainLabel}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tighter text-gray-300">
            {serviceFunctions.ai.title}
          </h2>
          <p className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed">
            {serviceFunctions.ai.desc}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {serviceFunctions.ai.features.map((feature, i) => (
              <div key={i} className="relative overflow-hidden bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 group hover:border-[#FF3B30]/30 transition-all duration-500">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF3B30] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                <p className="text-base md:text-lg font-bold text-gray-700 leading-tight">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-[#0a0a0a] rounded-[30px] text-white">
            <p className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-[0.2em]">Current Objective</p>
            <p className="text-lg md:text-xl font-bold leading-snug">
              "정체성이 내재된 AI는 도구를 넘어 비즈니스의 페르소나가 됩니다."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
