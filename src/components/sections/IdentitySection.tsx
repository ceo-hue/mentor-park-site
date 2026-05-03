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
      className="py-20 md:py-32 lg:py-40 px-6 md:px-10 lg:px-24 bg-[#0a0a0a] text-white overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="mb-12 md:mb-20"
        >
          <span className="text-gray-500 font-mono tracking-widest uppercase text-xs md:text-sm">
            The Fundamental Question
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mt-6 mb-10 tracking-tighter text-[#FF3B30]">
            "{brandPhilosophy.identityParadox.question}"
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
            className="p-8 md:p-12 bg-white/5 rounded-[30px] border border-white/10"
          >
            <h3 className="text-[#FF3B30] text-xl md:text-2xl font-bold mb-4">FEAR : 공포</h3>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              {brandPhilosophy.identityParadox.fear}
              <br />
              <span className="text-sm mt-4 block text-gray-600">
                "나를 이용하려는 스파이는 아닐까? 나의 핵심을 빼앗기지는 않을까?"
              </span>
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
            className="p-8 md:p-12 bg-[#0057FF]/10 rounded-[30px] border border-[#0057FF]/20"
          >
            <h3 className="text-[#0057FF] text-xl md:text-2xl font-bold mb-4">TRUST : 신뢰</h3>
            <p className="text-gray-100 text-lg md:text-xl leading-relaxed">
              {brandPhilosophy.identityParadox.trust}
              <br />
              <span className="text-sm mt-4 block text-[#0057FF]/70">
                "정체성이 명확한 사람은 흔들리지 않습니다. 그리고 그 정체성은 당신의 성공과 연결됩니다."
              </span>
            </p>
          </motion.div>
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={3}
          className="mt-16 md:mt-24 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-300 leading-tight italic"
        >
          {brandPhilosophy.identityParadox.conclusion}
        </motion.p>
      </div>
    </section>
  );
}
