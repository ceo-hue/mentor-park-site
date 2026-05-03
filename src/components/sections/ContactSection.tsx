"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { scaleIn } from "../../data/animations";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer
      id="contact"
      ref={ref}
      className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-20 md:py-0"
    >
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-10 leading-tight">
          당신의 질문을
          <br />
          바꿀 준비가 되셨습니까?
        </h2>
        <p className="text-gray-500 text-sm md:text-base mb-8 md:mb-12 max-w-md mx-auto">
          통찰은 올바른 질문에서 시작됩니다.
          <br />
          지금 멘토링 상담을 예약하세요.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#0057FF] text-white px-8 md:px-12 py-4 md:py-6 rounded-full text-lg md:text-2xl font-bold hover:bg-[#0046cc] transition-colors cursor-pointer"
        >
          멘토링 상담 예약하기
        </motion.button>
      </motion.div>

      <div className="mt-16 md:mt-24 text-xs text-gray-600 flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <span>&copy; 2025 박용근. All rights reserved.</span>
        <span className="hidden md:inline">|</span>
        <span>한성대학교 캠퍼스타운 총괄매니저</span>
      </div>
    </footer>
  );
}
