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
        {/* 첫 화면의 마지막 한 화면 뒤에 겹쳐 두어, 행성 안쪽 구멍으로 그대로 드러나게 한다 (여백은 HyperScene이 맞춘다) */}
        <div id="m-problem-wrap" className="relative z-10">
          <ProblemScene />
        </div>
        <MethodScene />
        <PracticeScene />
        <GuidesScene />
        <NetworkScene />
        <ContactScene />
      </main>
    </div>
  );
}
