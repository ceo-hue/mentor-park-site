"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeUp } from "../../data/animations";
import { galleryImages, CLOUD_NAME } from "../../data/siteData";

export function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImg, setSelectedImg] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const getCloudinaryUrl = (file: string, width: number) =>
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/gallery/${file}`;

  const scrollImages = [...galleryImages, ...galleryImages];

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-20 md:py-32 lg:py-40 bg-white text-black overflow-hidden"
    >
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
