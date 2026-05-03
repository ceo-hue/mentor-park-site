"use client";

import { motion } from "framer-motion";

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 lg:px-24 mix-blend-difference"
    >
      <span className="text-sm font-bold tracking-widest uppercase text-white">
        ONAIR PLANET
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
