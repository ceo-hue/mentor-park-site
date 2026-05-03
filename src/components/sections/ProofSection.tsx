"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { fadeUp } from "../../data/animations";

import { careerData } from "../../data/siteData";

export function ProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".bento-card", {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proof"
      className="py-24 md:py-48 lg:py-64 px-6 md:px-10 lg:px-24 bg-white text-black rounded-t-[60px] md:rounded-t-[100px] lg:rounded-t-[150px]"
    >
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="mb-16 md:mb-32"
        >
          <span className="text-[#0057FF] font-mono tracking-[0.4em] uppercase text-xs md:text-sm mb-6 block">
            Empirical Credibility
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            Verified Authority
          </h2>
        </motion.div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
        >
          {/* 메인 이력 카드 */}
          <div className="bento-card md:col-span-8 bg-gray-50 p-10 md:p-16 rounded-[40px] flex flex-col justify-between hover:bg-gray-100 transition-colors min-h-[300px] md:min-h-[400px] border border-gray-100">
            <div>
              <span className="text-[#0057FF] font-bold uppercase tracking-widest text-xs md:text-sm">
                Current Role
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mt-6 leading-[1.1] tracking-tight">
                {careerData.current.role}
                <br />
                <span className="text-[#0057FF]">{careerData.current.title}</span>
              </h3>
            </div>
            <p className="text-gray-500 mt-10 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
              {careerData.current.desc}
            </p>
          </div>

          {/* 경험 수치 카드 */}
          <div className="bento-card md:col-span-4 bg-[#0057FF] p-10 rounded-[40px] text-white flex flex-col justify-center items-center min-h-[300px] group">
            <div className="text-center">
              <span className="text-7xl md:text-8xl lg:text-9xl font-black italic tracking-tighter block group-hover:scale-110 transition-transform duration-500">
                15+
              </span>
              <p className="mt-4 font-bold tracking-widest uppercase text-sm md:text-base opacity-80">
                Years of Excellence
              </p>
            </div>
          </div>

          {/* 상세 지표 그리드 영역 */}
          <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {careerData.stats.map((stat, i) => (
              <div key={i} className="bento-card bg-gray-50 p-8 md:p-10 rounded-[40px] border border-gray-100 flex flex-col justify-between group">
                <span className="text-4xl md:text-5xl font-black text-[#0057FF] block group-hover:-translate-y-2 transition-transform duration-300">
                  {stat.number}
                </span>
                <div className="mt-8">
                  <h4 className="text-lg md:text-xl font-bold mb-2">{stat.label}</h4>
                  <p className="text-sm text-gray-500">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 풀 등록 현황 카드 */}
          <div className="bento-card md:col-span-5 bg-[#0a0a0a] p-10 md:p-12 rounded-[40px] text-white flex flex-col justify-between min-h-[400px]">
            <h4 className="text-2xl md:text-3xl font-black italic mb-10 leading-tight">
              Professional
              <br />
              <span className="text-[#0057FF]">Registrations</span>
            </h4>
            <ul className="space-y-4">
              {careerData.registrations.map((item, i) => (
                <li key={i} className="flex justify-between items-center border-b border-white/10 pb-3 group">
                  <span className="text-sm md:text-base text-gray-400 group-hover:text-white transition-colors">{item.name}</span>
                  <span className="text-[10px] md:text-xs font-mono text-gray-600 uppercase">{item.period}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IR 피칭 전문성 카드 */}
          <div className="bento-card md:col-span-7 bg-gray-50 p-10 md:p-16 rounded-[40px] flex flex-col md:flex-row gap-12 min-h-[400px] border border-gray-100 overflow-hidden relative">
            <div className="flex-1 z-10">
              <span className="text-[#FF3B30] font-bold uppercase tracking-widest text-xs mb-4 block">Specialty</span>
              <h4 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
                {careerData.specialty.title}
              </h4>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                {careerData.specialty.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {careerData.specialty.highlights.map((h, i) => (
                  <span key={i} className="bg-white border border-gray-200 px-4 py-2 rounded-full text-xs font-bold text-gray-600">
                    + {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
              <span className="text-[20vw] font-black italic leading-none">PITCH</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
