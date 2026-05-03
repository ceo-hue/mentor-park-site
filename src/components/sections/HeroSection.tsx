"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ParticleBackground } from "../ui/ParticleBackground";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
      )
        .from(
          titleRef.current,
          { y: "100%", duration: 1.2, ease: "power4.out" },
          "-=0.6"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.8"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col justify-center px-6 md:px-10 lg:px-24 overflow-hidden"
    >
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-transparent pointer-events-none z-[1]" />

      <div className="relative z-10">
        <p
          ref={tagRef}
          className="text-[#0057FF] font-mono tracking-[0.3em] uppercase mb-4 md:mb-8 block text-[10px] md:text-sm opacity-0"
        >
          Architect of ARHA & Business Identity
        </p>
        <div className="hero-title-mask">
          <h1
            ref={titleRef}
            className="text-[11vw] sm:text-[10vw] lg:text-[7.5vw] font-black leading-[0.85] tracking-tighter"
          >
            비즈니스의 <span className="text-[#FF3B30]">정체성</span>을
            <br />
            완성하다<span className="text-[#0057FF]">.</span>
          </h1>
        </div>
        <div className="overflow-hidden">
          <p
            ref={descRef}
            className="mt-10 md:mt-16 text-gray-400 text-sm md:text-xl lg:text-2xl max-w-4xl opacity-0 leading-relaxed"
          >
            정체성이 없는 비즈니스는 파편화된 기능의 집합일 뿐입니다.
            <br />
            ARHA 시스템을 통해 비즈니스의 영혼을 설계하고,
            <br />
            흔들리지 않는 <span className="text-white font-bold">Value Chain</span>을 구축합니다.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-600 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
