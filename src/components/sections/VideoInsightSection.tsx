"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeUp } from "../../data/animations";
import { videoData } from "../../data/siteData";

export function VideoInsightSection() {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    provider: string;
    type: "youtube" | "external";
    url: string;
  } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
        {videoData.map((vid, i) => (
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
            <img
              src={vid.thumbnail || `https://img.youtube.com/vi/${vid.id}/maxresdefault.jpg`}
              alt={vid.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                if (!vid.thumbnail) {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`;
                }
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white text-black px-5 py-2.5 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-base">
                {vid.type === "youtube" ? "PLAY INSIGHT" : "VIEW INSIGHT ↗"}
              </span>
            </div>

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
