"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "../../data/animations";
import { brandPhilosophy } from "../../data/siteData";

export function IdentitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="identity-philosophy"
      ref={ref}
      className="py-20 md:py-40 lg:py-60 px-6 md:px-10 lg:px-24 bg-[#0a0a0a] text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="mb-20 md:mb-32"
        >
          <span className="text-[#0057FF] font-mono tracking-[0.4em] uppercase text-xs md:text-sm mb-6 block">
            The Fundamental Question
          </span>
          <h2 className="text-[9vw] md:text-[7vw] font-black mt-6 mb-10 tracking-tighter leading-[0.9]">
            {brandPhilosophy.identityParadox.question}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 text-left relative">
          {/* FEAR 영역 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
            className="group p-10 md:p-16 bg-white/[0.02] rounded-[40px] border border-white/5 hover:bg-white/[0.04] transition-colors duration-700"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[#FF3B30]" />
              <h3 className="text-[#FF3B30] text-xl md:text-2xl font-black tracking-widest uppercase">FEAR</h3>
            </div>
            <p className="text-gray-400 text-xl md:text-3xl font-bold leading-tight tracking-tight">
              {brandPhilosophy.identityParadox.fear}
            </p>
            <p className="mt-8 text-gray-600 text-sm md:text-base leading-relaxed max-w-sm">
              방향을 잃은 비즈니스는 외부의 자극에 쉽게 흔들리고, 결국 자신의 가치를 증명하지 못한 채 소멸의 길을 걷게 됩니다.
            </p>
          </motion.div>

          {/* TRUST 영역 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
            className="group p-10 md:p-16 bg-[#0057FF]/[0.03] rounded-[40px] border border-[#0057FF]/10 hover:bg-[#0057FF]/[0.08] transition-colors duration-700"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[#0057FF]" />
              <h3 className="text-[#0057FF] text-xl md:text-2xl font-black tracking-widest uppercase">TRUST</h3>
            </div>
            <p className="text-gray-100 text-xl md:text-3xl font-bold leading-tight tracking-tight">
              {brandPhilosophy.identityParadox.trust}
            </p>
            <p className="mt-8 text-[#0057FF]/50 text-sm md:text-base leading-relaxed max-w-sm">
              명확한 정체성은 단순한 선언이 아닙니다. 그것은 시장이 당신을 신뢰하게 만드는 가장 강력한 실체이자, 대체 불가능한 자산입니다.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={3}
          className="mt-24 md:mt-40 max-w-4xl mx-auto"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter">
            박용근은 비즈니스의 보이지 않는 <span className="text-[#0057FF]">마음</span>을 설계하여,
            <br className="hidden md:block" />
            시장이 신뢰할 수 있는 <span className="underline decoration-[#FF3B30] decoration-4 underline-offset-8">실체적 가치사슬</span>을 구축합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
