"use client";

import { useSmoothScroll } from "./engine";
import { Chrome } from "./Chrome";
import { ProblemScene } from "./scenes/ProblemScene";
import { MethodScene } from "./scenes/MethodScene";
import { PracticeScene } from "./scenes/PracticeScene";
import { NetworkScene } from "./scenes/NetworkScene";
import { ContactScene } from "./scenes/ContactScene";
import { HyperScene } from "./scenes/HyperScene";
import { GuidesScene } from "./scenes/GuidesScene";

/** 메인 사이트: 기업형 모션그래픽. 이전 개인형 사이트는 /classic 에 남아 있다 */
export default function MotionSite() {
  useSmoothScroll();
  return (
    <div className="motion-site relative overflow-x-clip">
      <Chrome />
      <main>
        <HyperScene />
        <ProblemScene />
        <MethodScene />
        <PracticeScene />
        <GuidesScene />
        <NetworkScene />
        <ContactScene />
      </main>
    </div>
  );
}
