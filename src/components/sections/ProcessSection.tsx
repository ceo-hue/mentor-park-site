"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "../../data/animations";

export function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      step: "01",
      title: "진단",
      desc: "창업 아이템의 시장성과 실현 가능성을 다각도로 분석합니다.",
    },
    {
      step: "02",
      title: "전략",
      desc: "비즈니스 모델을 정교화하고 실행 가능한 로드맵을 수립합니다.",
    },
    {
      step: "03",
      title: "실행",
      desc: "IR 피칭, 정부지원사업 신청 등 실질적인 액션 플랜을 함께합니다.",
    },
    {
      step: "04",
      title: "성장",
      desc: "지속 가능한 성장 구조를 설계하고 네트워크를 연결합니다.",
    },
  ];

  return (
    <section
      id="process"
      className="py-20 md:py-32 lg:py-40 px-6 md:px-10 lg:px-24 bg-[#0a0a0a] text-white rounded-t-[40px] md:rounded-t-[60px] lg:rounded-t-[100px]"
    >
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={0}
        className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-8 md:mb-16"
      >
        Mentoring Process
      </motion.p>

      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {steps.map((item, i) => (
          <motion.div
            key={item.step}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={i + 1}
            className="border border-white/10 rounded-[20px] md:rounded-[30px] p-6 md:p-8 hover:border-[#0057FF]/50 transition-colors group"
          >
            <span className="text-4xl md:text-5xl font-black text-white/10 group-hover:text-[#0057FF]/30 transition-colors">
              {item.step}
            </span>
            <h3 className="text-xl md:text-2xl font-bold mt-4 md:mt-6">
              {item.title}
            </h3>
            <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
