"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { fadeUp } from "../../data/animations";

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
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proof"
      className="py-20 md:py-32 lg:py-40 px-6 md:px-10 lg:px-24 bg-white text-black rounded-t-[40px] md:rounded-t-[60px] lg:rounded-t-[100px]"
    >
      <div ref={ref}>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-3xl md:text-4xl lg:text-6xl font-bold mb-12 md:mb-20 tracking-tighter"
        >
          Verified Authority
        </motion.h2>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
      >
        <div className="bento-card md:col-span-8 bg-gray-50 p-8 md:p-10 lg:p-16 rounded-[30px] md:rounded-[40px] flex flex-col justify-between hover:bg-gray-100 transition-colors min-h-[260px] md:min-h-[320px]">
          <div>
            <span className="text-[#0057FF] font-bold uppercase tracking-widest text-xs md:text-sm">
              Current Role
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-3 md:mt-4 leading-tight">
              한성대학교 캠퍼스타운 사업단
              <br />
              기술창업센터 총괄매니저
            </h3>
          </div>
          <p className="text-gray-500 mt-6 md:mt-10 max-w-md text-sm md:text-base">
            창업 생태계의 구조를 설계하고 예비 창업자의 성장을 가속화하는 시스템
            매니지먼트.
          </p>
        </div>

        <div className="bento-card md:col-span-4 bg-[#0057FF] p-8 md:p-10 rounded-[30px] md:rounded-[40px] text-white flex flex-col justify-center items-center min-h-[200px]">
          <span className="text-6xl md:text-7xl lg:text-8xl font-black italic">
            10+
          </span>
          <p className="mt-3 md:mt-4 font-medium opacity-80 text-sm md:text-base">
            Years of Experience
          </p>
        </div>

        <div className="bento-card md:col-span-4 bg-[#0a0a0a] p-8 md:p-10 rounded-[30px] md:rounded-[40px] text-white flex flex-col justify-between min-h-[240px]">
          <h4 className="text-xl md:text-2xl font-bold italic mb-4 md:mb-6">
            멘토 및 평가위원
            <br />
            <span className="text-sm font-normal not-italic text-gray-500">
              풀 등록 현황
            </span>
          </h4>
          <ul className="space-y-2 md:space-y-3 text-gray-400 text-sm md:text-base">
            <li>창업진흥원 평가위원 풀 등록 <span className="text-gray-600">2023~현재</span></li>
            <li>경기콘텐츠진흥원 평가·심의위원 풀 등록 <span className="text-gray-600">2024~현재</span></li>
            <li>경기콘텐츠진흥원 문화창업플래너 풀 등록 <span className="text-gray-600">2019~현재</span></li>
            <li>성남산업진흥원 창업전문위원 풀 등록 <span className="text-gray-600">2023~현재</span></li>
            <li>창업진흥원 예비창업패키지 전담멘토 풀 등록 <span className="text-gray-600">2019~2023</span></li>
            <li>한성대학교 창업멘토 풀 등록 <span className="text-gray-600">2021~2022</span></li>
            <li>동국대학교 창업전문기업 풀 등록 <span className="text-gray-600">2023~2025</span></li>
          </ul>
        </div>

        <div className="bento-card md:col-span-8 bg-gray-50 p-8 md:p-10 lg:p-16 rounded-[30px] md:rounded-[40px] flex flex-col md:flex-row gap-6 md:gap-10 min-h-[220px]">
          <div className="flex-1">
            <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              IR 피칭 컨설팅
            </h4>
            <p className="text-gray-500 text-sm md:text-base">
              보이스 트레이닝과 커뮤니케이션 기술을 결합하여 투자자의 마음을
              움직이는 설득의 구조를 설계합니다.
            </p>
          </div>
          <div className="flex-1 md:border-l md:border-gray-200 md:pl-10 font-mono text-xs md:text-sm text-gray-600 space-y-2">
            <p>+ 창업에듀 교육영상</p>
            <p>+ K-STARTUP 본선 멘토</p>
            <p>+ LG디스플레이 초청강의</p>
          </div>
        </div>
      </div>
    </section>
  );
}
