"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "../../data/animations";

export function ExpertiseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { number: "15+", label: "년 경력", desc: "창업·경영 멘토링" },
    { number: "200+", label: "팀 멘토링", desc: "예비~초기 창업자 지원" },
    { number: "50+", label: "기업 컨설팅", desc: "사업화 전략 수립" },
    { number: "30+", label: "강연 & 교육", desc: "대학·기관 출강" },
  ];

  return (
    <section
      id="expertise"
      ref={ref}
      className="py-20 md:py-32 lg:py-40 px-6 md:px-10 lg:px-24 bg-white text-black"
    >
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={0}
        className="text-sm font-mono text-gray-400 tracking-widest uppercase mb-8 md:mb-16"
      >
        Expertise in Numbers
      </motion.p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={i + 1}
            className="border-t-2 border-black pt-6 md:pt-8"
          >
            <span className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0057FF]">
              {stat.number}
            </span>
            <h4 className="text-lg md:text-xl font-bold mt-2">{stat.label}</h4>
            <p className="text-sm text-gray-500 mt-1">{stat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
