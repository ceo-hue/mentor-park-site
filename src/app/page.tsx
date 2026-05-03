"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { IdentitySection } from "@/components/sections/IdentitySection";
import { FunctionSection } from "@/components/sections/FunctionSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { VideoInsightSection } from "@/components/sections/VideoInsightSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ContactSection } from "@/components/sections/ContactSection";

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
      <IdentitySection />
      <FunctionSection />
      <ProofSection />
      <VideoInsightSection />
      <GallerySection />
      <ExpertiseSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
