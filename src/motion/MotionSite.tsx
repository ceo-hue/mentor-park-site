"use client";

import { useSmoothScroll } from "./engine";
import { Chrome } from "./Chrome";
import { HeroScene } from "./scenes/HeroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { MethodScene } from "./scenes/MethodScene";
import { PracticeScene } from "./scenes/PracticeScene";
import { CaseScene } from "./scenes/CaseScene";
import { NetworkScene } from "./scenes/NetworkScene";
import { ContactScene } from "./scenes/ContactScene";
import { HyperScene } from "./scenes/HyperScene";
import { FilmScene } from "./scenes/FilmScene";
import { GuidesScene } from "./scenes/GuidesScene";

/** 메인 사이트: 기업형 모션그래픽. 이전 개인형 사이트는 /classic 에 남아 있다 */
export default function MotionSite() {
  useSmoothScroll();
  return (
    <div className="motion-site relative overflow-x-clip">
      <Chrome />
      <main>
        <HeroScene />
        <ProblemScene />
        <MethodScene />
        <HyperScene />
        <PracticeScene />
        <CaseScene />
        <FilmScene />
        <GuidesScene />
        <NetworkScene />
        <ContactScene />
      </main>
    </div>
  );
}
