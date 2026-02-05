"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── 애니메이션 Variants ── */
const fadeUp = {
  hidden: { y: 60, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/* ── Navigation ── */
function Navigation() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 lg:px-24 mix-blend-difference"
    >
      <span className="text-sm font-bold tracking-widest uppercase text-white">
        YK PARK
      </span>
      <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
        <a href="#proof" className="hover:text-white transition-colors">
          경력
        </a>
        <a href="#videos" className="hover:text-white transition-colors">
          인사이트
        </a>
        <a href="#process" className="hover:text-white transition-colors">
          프로세스
        </a>
        <a href="#contact" className="hover:text-white transition-colors">
          상담예약
        </a>
      </div>
      <a
        href="#contact"
        className="md:hidden text-xs font-bold text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        상담예약
      </a>
    </motion.nav>
  );
}

/* ── Hero Section ── */
function HeroSection() {
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <p
          ref={tagRef}
          className="text-[#0057FF] font-mono tracking-widest uppercase mb-4 md:mb-6 block text-xs md:text-sm opacity-0"
        >
          The Architect of Insight
        </p>
        <div className="hero-title-mask">
          <h1
            ref={titleRef}
            className="text-[12vw] sm:text-[10vw] lg:text-[10vw] font-black leading-[0.85] tracking-tighter"
          >
            정보는 <span className="text-gray-800">AI</span>가,
            <br />
            결정은{" "}
            <span className="italic text-[#0057FF]">통찰</span>이.
          </h1>
        </div>
        <p
          ref={descRef}
          className="mt-8 md:mt-12 text-gray-400 text-base md:text-lg lg:text-2xl max-w-2xl opacity-0"
        >
          박용근은 검색으로 닿을 수 없는 비즈니스의 본질을 설계합니다.
        </p>
      </div>

      {/* 스크롤 인디케이터 */}
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

/* ── Proof / Bento Grid Section ── */
function ProofSection() {
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
        {/* 메인 이력 카드 */}
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

        {/* 10+ 경력 카드 */}
        <div className="bento-card md:col-span-4 bg-[#0057FF] p-8 md:p-10 rounded-[30px] md:rounded-[40px] text-white flex flex-col justify-center items-center min-h-[200px]">
          <span className="text-6xl md:text-7xl lg:text-8xl font-black italic">
            10+
          </span>
          <p className="mt-3 md:mt-4 font-medium opacity-80 text-sm md:text-base">
            Years of Experience
          </p>
        </div>

        {/* 멘토 및 평가위원 풀 등록 현황 카드 */}
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

        {/* IR 피칭 컨설팅 카드 */}
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

/* ── Video Insight Section ── */
function VideoInsightSection() {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    provider: string;
    type: "youtube" | "external";
    url: string;
  } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const videos = [
    {
      id: "dEIglevKkdA",
      title: "예시로 알아보는 사업계획서",
      provider: "K-스타트업, 창업에듀 · 2021년 14차시",
      type: "youtube" as const,
      url: "https://www.youtube.com/watch?v=dEIglevKkdA&t=1151s",
    },
    {
      id: "seoulsbdc",
      title: "항목별 키포인트로 술술쓰는 사업계획서",
      provider: "서울시 자영업지원센터 · 2023년",
      type: "external" as const,
      url: "https://www.seoulsbdc.or.kr/main.do",
    },
    {
      id: "gmr",
      title: "예비창업자를 위한 사업계획서 핵심 가이드",
      provider: "경기도 자영업 아카데미 · 2023년",
      type: "external" as const,
      url: "https://edu.gmr.or.kr/onlineCos/contentsPreview/1823",
    },
  ];

  return (
    <section
      id="videos"
      ref={ref}
      className="py-20 md:py-32 lg:py-40 px-6 md:px-10 lg:px-24 bg-white text-black"
    >
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={0}
        className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 tracking-tighter"
      >
        Watch Insights
      </motion.h2>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={1}
        className="text-gray-400 text-sm md:text-base mb-10 md:mb-16"
      >
        예비 ~ 초기 단계 스타트업을 위한 핵심 인사이트 영상
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {videos.map((vid, i) => (
          <motion.div
            key={vid.id}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={i + 2}
            layoutId={vid.id}
            onClick={() => {
              if (vid.type === "external") {
                window.open(vid.url, "_blank", "noopener,noreferrer");
              } else {
                setSelectedVideo(vid);
              }
            }}
            className="cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl bg-gray-200 aspect-video relative group"
          >
            {/* YouTube 썸네일 */}
            <img
              src={`https://img.youtube.com/vi/${vid.id}/maxresdefault.jpg`}
              alt={vid.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

            {/* 재생/링크 버튼 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white text-black px-5 py-2.5 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-base">
                {vid.type === "youtube" ? "PLAY INSIGHT" : "VIEW INSIGHT ↗"}
              </span>
            </div>

            {/* 영상 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
              <p className="text-white font-bold text-sm md:text-lg">
                {vid.title}
              </p>
              <p className="text-white/60 text-xs md:text-sm mt-1">
                {vid.provider}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 영상 모달 */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              layoutId={selectedVideo.id}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&start=1151`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white text-base md:text-xl font-light hover:opacity-70 transition-opacity cursor-pointer"
              >
                CLOSE &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Mentoring Gallery Section ── */
function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImg, setSelectedImg] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const CLOUD_NAME = "dhohspefk";

  // Cloudinary 사진 목록 — 업로드 후 파일명만 교체하면 됩니다
  const galleryImages = [
    { file: "sample1", alt: "멘토링 현장 1" },
    { file: "sample2", alt: "멘토링 현장 2" },
    { file: "sample3", alt: "멘토링 현장 3" },
    { file: "sample4", alt: "멘토링 현장 4" },
    { file: "sample5", alt: "멘토링 현장 5" },
    { file: "sample6", alt: "멘토링 현장 6" },
    { file: "sample7", alt: "멘토링 현장 7" },
    { file: "sample8", alt: "멘토링 현장 8" },
  ];

  const getCloudinaryUrl = (file: string, width: number) =>
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/gallery/${file}`;

  // 자동 스크롤용 이미지 (2배로 반복해서 끊김 없이)
  const scrollImages = [...galleryImages, ...galleryImages];

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-20 md:py-32 lg:py-40 bg-white text-black overflow-hidden"
    >
      {/* 섹션 헤더 */}
      <div className="px-6 md:px-10 lg:px-24">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-sm font-mono text-gray-400 tracking-widest uppercase mb-4"
        >
          Mentoring Gallery
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1}
          className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 tracking-tighter"
        >
          현장의 기록
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={2}
          className="text-gray-400 text-sm md:text-base mb-10 md:mb-16"
        >
          멘토링, 강연, 평가 현장에서 함께한 순간들
        </motion.p>
      </div>

      {/* 자동 스크롤 갤러리 */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={3}
        className="mb-12 md:mb-20"
      >
        <div className="flex gap-4 animate-scroll">
          {scrollImages.map((img, i) => (
            <div
              key={`scroll-${i}`}
              onClick={() =>
                setSelectedImg({
                  src: getCloudinaryUrl(img.file, 1200),
                  alt: img.alt,
                })
              }
              className="flex-shrink-0 w-[280px] md:w-[360px] lg:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img
                src={getCloudinaryUrl(img.file, 600)}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* 그리드 갤러리 */}
      <div className="px-6 md:px-10 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={`grid-${img.file}`}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i * 0.5 + 4}
              onClick={() =>
                setSelectedImg({
                  src: getCloudinaryUrl(img.file, 1200),
                  alt: img.alt,
                })
              }
              className="aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group relative"
            >
              <img
                src={getCloudinaryUrl(img.file, 400)}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImg.src}
                alt={selectedImg.alt}
                className="w-full h-full object-contain rounded-2xl"
              />
              <p className="text-white/70 text-sm text-center mt-4">
                {selectedImg.alt}
              </p>
              <button
                onClick={() => setSelectedImg(null)}
                className="absolute top-4 right-4 text-white text-xl font-light hover:opacity-70 transition-opacity cursor-pointer"
              >
                CLOSE &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Expertise / Numbers Section ── */
function ExpertiseSection() {
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

/* ── Mentoring Process Section ── */
function ProcessSection() {
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

/* ── Contact / Footer Section ── */
function ContactSection() {
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

/* ── Main Page ── */
export default function Home() {
  // Lenis 부드러운 스크롤 초기화
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-[#0a0a0a] text-white">
      <Navigation />
      <HeroSection />
      <ProofSection />
      <VideoInsightSection />
      <GallerySection />
      <ExpertiseSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
