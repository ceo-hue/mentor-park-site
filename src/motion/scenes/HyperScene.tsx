"use client";

/** 파스텔 배경과 행성이 함께 펼쳐지며 첫 상담 장면으로 이어지는 오프닝 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LOGO } from "@/lib/logo";
import { hero, hyper } from "../content";
import { ScrollTrigger } from "../engine";
import { LIGHT_FRAG, LIGHT_VERT } from "../hyperShader";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
};
const damp = (a: number, b: number, k: number, dt: number) => lerp(a, b, 1 - Math.exp(-k * dt));
const rad = (d: number) => (d * Math.PI) / 180;
const isMobile = () => window.innerWidth < 900;

/* ---------- 시드 고정 글자 등장 (원본 buildStag) ---------- */
function seeded(text: string, salt?: string) {
  let h = 0x811c9dc5;
  const s = salt ? text + "\0" + salt : text;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x1000193);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function stagDelays(text: string, n: number, spread: number) {
  const r = seeded(text);
  const o: number[] = [];
  for (let i = 0; i < n; i++) o.push(n <= 1 ? 0 : Math.min(spread, (i / (n - 1)) * spread * 0.7 + r() * spread * 0.35));
  return o;
}
function buildStag(el: HTMLElement, text: string, startMs: number, groupMs = 0) {
  el.classList.add("hy-stag");
  el.textContent = "";
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = text.replace(/\|/g, " ");
  el.appendChild(sr);
  const wrap = document.createElement("span");
  wrap.setAttribute("aria-hidden", "true");
  el.appendChild(wrap);
  const lines = text.split("|");
  lines.forEach((line, li) => {
    const arr = Array.from(line);
    const d = stagDelays(line, arr.length, 290);
    let idx = 0;
    line.split(" ").forEach((word, wi) => {
      if (wi > 0) {
        wrap.appendChild(document.createTextNode(" "));
        idx++;
      }
      const w = document.createElement("span");
      w.className = "hy-w";
      Array.from(word).forEach((c) => {
        const sp = document.createElement("span");
        sp.className = "hy-ch";
        sp.textContent = c;
        sp.style.setProperty("--dl", ((d[idx] + startMs + li * 120 + groupMs) / 1000).toFixed(3) + "s");
        w.appendChild(sp);
        idx++;
      });
      wrap.appendChild(w);
    });
    if (li < lines.length - 1) wrap.appendChild(document.createElement("br"));
  });
}
function fillBig(el: HTMLElement, lines: readonly string[]) {
  el.textContent = "";
  lines.forEach((l, i) => {
    const s = document.createElement("span");
    el.appendChild(s);
    buildStag(s, l, 0, i * 100);
    s.style.setProperty("--line-delay", `${i * 115}ms`);
    s.classList.add("play");
  });
}

/* ---------- 고리 7개 (원본 ringsDraw) ---------- */
const RINGS = 7;
const HALF = new Float32Array(301);
for (let k = 0; k <= 300; k++) {
  const t = k - 150;
  const r = 22500 - t * t;
  HALF[k] = r > 0 ? Math.sqrt(r) : 0;
}
const RC = { enter: 300, exit: 345, cycle: 300, total: 600 + 345 };
function ringsDraw(els: SVGEllipseElement[], p: number) {
  const r = clamp(p, 0, 1) * RC.total;
  let n = 0;
  let i = r;
  if (r > RC.enter) {
    if (r <= RC.enter + RC.cycle) {
      n = 1;
      i = r - RC.enter;
    } else {
      n = 2;
      i = r - RC.enter - RC.cycle;
    }
  }
  const o = n === 0 ? (i / 50) | 0 : 0;
  const seen: number[] = [];
  for (let t = 0; t < RINGS; t++) {
    const el = els[t];
    let l = 0;
    let s = false;
    if (n === 0) s = i >= 50 * t && (l = i - ((o < 6 ? o : 6) - t) * 50) > 0 && l < 300;
    else if (n === 1) s = (l = (((i + 50 * t) % 300) + 300) % 300) > 0 && l < 300;
    else s = (l = i + 50 * t) > 0 && l < 300;
    if (!s) {
      el.setAttribute("visibility", "hidden");
      continue;
    }
    const f = Math.floor(l);
    const fr = l - f;
    const u = HALF[f] + (HALF[Math.min(300, f + 1)] - HALF[f]) * fr;
    if (u <= 0 || seen.some((q) => Math.abs(q - l) < 0.5)) {
      el.setAttribute("visibility", "hidden");
      continue;
    }
    seen.push(l);
    el.setAttribute("visibility", "visible");
    el.setAttribute("cx", "172");
    el.setAttribute("cy", String(22 + l));
    el.setAttribute("rx", u.toFixed(2));
    el.setAttribute("ry", (u * 0.1).toFixed(2));
  }
}

const PLANET_VERT =
  "varying vec3 vN,vE;void main(){vec4 wp=modelMatrix*vec4(position,1.);gl_Position=projectionMatrix*viewMatrix*wp;vN=normalize(mat3(modelMatrix)*normal);vE=normalize(wp.xyz-cameraPosition);}";

const PLANET_FRAG = [
  "uniform float uOpacity;uniform vec3 uAccent,uLight;varying vec3 vN,vE;",
  "float spec(vec3 light,vec3 n,vec3 e){vec3 l=normalize(-light);vec3 h=normalize(e+l);return pow(abs(dot(n,h)),40.)+max(0.,dot(n,l))*.1;}",
  "void main(){vec3 n=normalize(vN);vec3 e=normalize(vE);vec3 rgb=mix(uAccent,vec3(.48,.68,.91),.1);",
  " float f=pow(1.-abs(dot(e,n)),6.);rgb+=spec(uLight,n,e)*.64+f*.16;gl_FragColor=vec4(rgb,uOpacity);}",
].join("\n");


export function HyperScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const backdrop = backdropRef.current!;
    const canvas = canvasRef.current!;
    const stick = stickRef.current!;
    const problemWrap = document.getElementById("m-problem-wrap");
    const problemContent = document.querySelector<HTMLElement>("#m-problem > div");
    const motionOn = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stages = Array.from(stick.querySelectorAll<HTMLElement>(".hy-stage"));
    const bigA = stick.querySelector<HTMLElement>("[data-big='A']")!;
    const bigB = stick.querySelector<HTMLElement>("[data-big='B']")!;
    const bigD = stick.querySelector<HTMLElement>("[data-big='D']")!;
    const says = Array.from(stick.querySelectorAll<HTMLElement>(".hy-say"));
    const ringG = stick.querySelector<SVGGElement>("[data-ring-g]")!;
    const ringEls: SVGEllipseElement[] = [];
    for (let i = 0; i < RINGS; i++) {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      el.setAttribute("visibility", "hidden");
      ringG.appendChild(el);
      ringEls.push(el);
    }
    says.forEach((el) => buildStag(el, el.dataset.stag!, 0));

    /* ---------- WebGL ---------- */
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      renderer = null;
    }
    const CAMZ = 14;
    const FOV = 35;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
    camera.position.set(0, 0, CAMZ);
    let W = 1;
    let H = 1;
    let pr = 1;
    const worldH = (z: number) => 2 * Math.tan(rad(FOV / 2)) * (CAMZ - z);
    const worldW = (z: number) => (worldH(z) * W) / H;

    const uLight = { value: new THREE.Vector3(4, 9, 0.5) };
    const planetMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 1 },
        uAccent: { value: new THREE.Color(LOGO.color) },
        uLight,
      },
      vertexShader: PLANET_VERT,
      fragmentShader: PLANET_FRAG,
      transparent: true,
    });
    const lightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iRes: { value: new THREE.Vector3(1, 1, 1) },
        iTime: { value: 0 },
        uDur: { value: 2 },
        uOpacity: { value: 0 },
        uDark: { value: 0 },
        uPhase: { value: 0 },
        uCenter: { value: new THREE.Vector2() },
        uSA: { value: new THREE.Color("#83a9ed") },
        uSB: { value: new THREE.Color("#c695e9") },
      },
      vertexShader: LIGHT_VERT,
      fragmentShader: LIGHT_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    // 빛줄기는 화면 좌표로 그려 행성과 고리의 윤곽에 잘리지 않게 한다.
    const light = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lightMaterial);
    light.frustumCulled = false;
    light.renderOrder = -1;

    // 도형: 행성 구체 + 기울어진 고리 (명함 측정값)
    const hy = new THREE.Group();
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), planetMaterial);
    const ringWrap = new THREE.Group();
    ringWrap.rotation.z = LOGO.ringRoll;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LOGO.ringRadius, LOGO.stroke * 1.6, 24, 220), planetMaterial);
    ring.rotation.x = LOGO.ringTilt;
    ringWrap.add(ring);
    hy.add(planet, ringWrap);
    [planet, ring].forEach((m) => (m.frustumCulled = false));
    scene.add(light, hy);

    // 모바일에서는 주소창이 접히고 펴질 때마다 innerHeight가 바뀐다.
    // 무대(100svh) 높이를 기준으로 삼아 스크롤 중에 섹션 길이가 바뀌지 않게 한다.
    let laidW = 0;
    let laidH = 0;
    const resize = () => {
      W = stick.clientWidth || window.innerWidth;
      H = stick.clientHeight || window.innerHeight;
      if (W === laidW && H === laidH) return; // 주소창만 움직인 경우
      const relayout = laidW !== 0;
      laidW = W;
      laidH = H;
      pr = Math.min(window.devicePixelRatio || 1, 2);
      section.style.height = `${H * 8}px`;
      if (relayout) requestAnimationFrame(() => ScrollTrigger.refresh());
      // 두 번째 페이지가 마지막 한 화면과 겹치도록
      if (problemWrap) problemWrap.style.marginTop = `${-H}px`;
      if (renderer) {
        renderer.setPixelRatio(pr);
        renderer.setSize(W, H, false);
      }
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      lightMaterial.uniforms.iRes.value.set(W * pr, H * pr, 1);
      lightMaterial.uniforms.uCenter.value.set((W * pr) / 2, (H * pr) / 2);
    };
    resize();
    // 겹침 여백이 바뀌었으니 뒤 장면들의 고정 위치를 다시 계산
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener("resize", resize);

    const pointer = { nx: 0, ny: 0, inside: false };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.inside = true;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ---------- 스크롤 구간에 맞춰 제목과 그래픽을 전환 ---------- */
    const bigLines = { A: hero.lines, B: hyper.stage1.lines, D: hyper.stage2.lines };
    let curStage = -1;
    let revealed = false;
    // 구간(화면 단위): 0~1 카드 열림·남색 반전 / 1~2.4 첫 문구 / 2.4~4 고리 / 4~6.2 둘째 문구와 행성 수축
    // 6.2~7 밝은 커튼이 덮음 / 7~8 섹션이 커튼째 빠져나가며 다음 장면과 이어진다
    const stageIdx = (u: number) => (u < 1 ? 0 : u < 2.4 ? 1 : u < 4 ? 2 : 3);
    const updateHyper = (rect: DOMRect, vh: number) => {
      const i = -rect.top;
      const st = stageIdx(Math.max(0, i) / vh);
      const inside = i > -vh * 0.5 && i < rect.height + vh * 0.5;
      if (!inside) {
        stages.forEach((s) => s.classList.remove("on"));
        says.forEach((s) => s.classList.remove("play"));
        curStage = -1;
        revealed = false;
        return;
      }
      const play = i >= -vh * 0.2;
      if (st !== curStage || (play !== revealed && (st === 0 || st === 1))) {
        const changed = st !== curStage;
        curStage = st;
        stages.forEach((s, k) => s.classList.toggle("on", k === st));
        says.forEach((s) => s.classList.toggle("play", st === 2));
        if (st === 0 || st === 1) {
          const host = st === 0 ? bigA : bigB;
          if (play) fillBig(host, st === 0 ? bigLines.A : bigLines.B);
          else host.textContent = "";
        } else if (st === 3 && changed) fillBig(bigD, bigLines.D);
        revealed = play;
      }
      if (st === 2) ringsDraw(ringEls, clamp((i - 2.4 * vh) / (1.6 * vh), 0, 1));
    };

    /* ---------- 프레임 (원본 frame의 하이퍼스페이스 부분) ---------- */
    const camOff = new THREE.Vector2();
    const camTar = new THREE.Vector2();
    let hyScale = 0;
    let hyInit = false;
    let drawn = false;
    let lastNight = -1;
    let lastCurtain = -1;
    let wasDark = false;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
      last = now;
      const vh = H; // 무대 높이 (주소창과 무관하게 일정)
      const rect = section.getBoundingClientRect();
      const hyTop = rect.top;
      const u = -hyTop / vh; // 섹션 안에서 내려온 화면 수
      // 첫 0.4화면은 그대로 두고, 0.4~0.9화면에서 한 번에 뒤집는다 (반쯤 남은 중간 상태를 만들지 않는다)
      const flip = motionOn ? smooth((u - 0.4) / 0.5) : Number(u > 0.6);
      // 행성 재등장: 4.6~5.6화면에 가운데서 0 → 원래 크기
      const exit = smooth((u - 4.6) / 1.0);
      // 통과: 5.6~7화면에 행성이 점점 빨라지며 커져 화면 밖으로 지나간다
      const fly = Math.pow(clamp((u - 5.6) / 1.4, 0, 1), 2.2);

      // 행성의 화면 위치(쉬는 자리). 남색 원은 이 점에서 퍼진다
      const desktop = W >= 768;
      const restX = desktop ? 0.285 : 0.18; // 화면 폭 대비
      const restY = desktop ? 0 : -0.24; // 화면 높이 대비(위가 +)
      const cxPx = W * (0.5 + restX);
      const cyPx = vh * (0.5 - restY);
      const diameter = desktop ? clamp(W * 0.14, 138, 220) : Math.min(96, vh * 0.15);
      const farthest = Math.max(
        Math.hypot(cxPx, cyPx),
        Math.hypot(W - cxPx, cyPx),
        Math.hypot(cxPx, vh - cyPx),
        Math.hypot(W - cxPx, vh - cyPx)
      );

      if (flip !== lastNight) {
        lastNight = flip;
        // 카드 틀이 열리는 것도 같은 순간에
        backdrop.style.setProperty("--open-frame", String(1 - flip));
        // 남색은 투명도로 서서히가 아니라, 행성 중심에서 원으로 퍼진다
        const r = flip <= 0 ? 0 : lerp(diameter * 0.5, farthest + 8, flip);
        backdrop.style.setProperty("--reveal-r", `${r}px`);
        backdrop.style.setProperty("--reveal-x", `${cxPx}px`);
        backdrop.style.setProperty("--reveal-y", `${cyPx}px`);
      }
      // 행성 크기 (반전 때는 원 속으로 작아지고, 마지막에는 가운데서 다시 커져 지나간다)
      const planetFactor = exit > 0 ? exit * lerp(1, 18, fly) : 1 - flip;
      if (!hyInit || !motionOn) {
        hyScale = planetFactor;
        hyInit = true;
      } else hyScale = damp(hyScale, planetFactor, 32, dt);

      // 다음 장면은 행성 안쪽에서 원으로 열린다: 원의 반지름은 커지는 행성 반지름을 따라간다
      const halfDiag = Math.hypot(W / 2, vh / 2);
      const open = fly > 0 ? (diameter / 2) * hyScale * 0.86 : 0;
      const covered = open >= halfDiag;
      if (open !== lastCurtain) {
        lastCurtain = open;
        // 무대(첫 화면 전체)에 원형 구멍을 내서 뒤의 두 번째 페이지가 보이게 한다
        stick.style.setProperty("--hole", `${Math.min(open, halfDiag + 8)}px`);
      }
      // 구멍으로 보이는 동안 두 번째 페이지는 위로 밀려 올라오지 않고 제자리에 머문다
      if (problemContent) {
        const pTop = problemWrap ? problemWrap.getBoundingClientRect().top : 0;
        if (open > 0 && pTop > 0) problemContent.style.transform = `translateY(${-pTop}px)`;
        else if (problemContent.style.transform) problemContent.style.transform = "";
      }
      // 원이 왼쪽 제목까지 덮은 뒤에 글자를 흰색으로, 밝은 원이 화면 절반을 넘으면 다시 어둡게
      const dark = flip > 0.8 && open < vh * 0.5 && rect.bottom > 0 && hyTop < vh * 0.5;
      stick.classList.toggle("on-dark", dark);
      if (dark !== wasDark) {
        wasDark = dark;
        window.dispatchEvent(new CustomEvent("hyper-dark", { detail: dark }));
      }

      const onScreen = rect.bottom > 0 && hyTop < vh;
      if (renderer && onScreen && !covered) {
        if (motionOn && pointer.inside && !isMobile()) camTar.set(pointer.nx * 0.9, pointer.ny * 0.55);
        else camTar.set(0, 0);
        camOff.lerp(camTar, motionOn ? 0.06 : 1);
        camera.position.set(camOff.x, camOff.y, CAMZ);
        camera.lookAt(0, 0, 0);
        uLight.value.set(pointer.nx * 10, pointer.ny * 8 + 4, 0.5);

        const zH = -3;
        const wH = worldH(zH);
        const wW = worldW(zH);
        const rest = (diameter * wH) / vh / 2;
        hy.scale.setScalar(Math.max(rest * hyScale, 1e-4));
        hy.visible = hyScale > 0.01;
        if (exit > 0) hy.position.set(0, 0, zH);
        else hy.position.set(restX * wW, restY * wH, zH);
        hy.rotation.set(0, (flip + exit + fly) * rad(180), 0);
        planetMaterial.uniforms.uOpacity.value = 1;

        // 빛줄기는 남색 위에서만
        const lightOpacity = smooth((flip - 0.5) / 0.5) * 0.9 * (1 - exit * 0.7);
        light.visible = lightOpacity > 0;
        lightMaterial.uniforms.uOpacity.value = lightOpacity;
        lightMaterial.uniforms.uDark.value = 1;
        lightMaterial.uniforms.iTime.value = 2 * clamp((vh - hyTop) / (rect.height + vh), 0, 1);

        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(scene, camera);
        drawn = true;
      } else if (drawn && renderer) {
        renderer.clear();
        drawn = false;
      }
      updateHyper(rect, vh);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      backdrop.style.removeProperty("--open-frame");
      if (problemWrap) problemWrap.style.marginTop = "";
      if (problemContent) problemContent.style.transform = "";
      backdrop.style.removeProperty("--reveal-r");
      backdrop.style.removeProperty("--reveal-x");
      backdrop.style.removeProperty("--reveal-y");
      window.dispatchEvent(new CustomEvent("hyper-dark", { detail: false }));
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      planet.geometry.dispose();
      ring.geometry.dispose();
      light.geometry.dispose();
      planetMaterial.dispose();
      lightMaterial.dispose();
      renderer?.dispose();
      ringEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <section
      id="m-intro"
      ref={sectionRef}
      aria-label={[
        hyper.stage1.lines.join(" "),
        hyper.stage1.ko,
        ...hyper.says.map((line) => line.replace(/\|/g, " ")),
        hyper.stage2.lines.join(" "),
        hyper.stage2.ko,
      ].join(" ")}
      className="relative isolate z-20 h-[800svh]"
    >
      <h1 className="sr-only">{hero.lines.join(" ")}</h1>
      <p className="sr-only">{[hero.kicker, hero.ko, hero.services.join(" · ")].join(". ")}</p>
      <div ref={stickRef} className="hy-stick" aria-hidden="true">
        {/* 효과 레이어는 무대(sticky) 안에만 있어 섹션과 함께 빠져나간다 */}
        <div ref={backdropRef} className="hy-backdrop">
          <div className="hy-night" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </div>
        <div className="hy-stage hy-seg0a on">
          <div className="hy-hero-copy">
            <p className="motion-kicker">{hero.kicker}</p>
            <div data-big="A" className="hy-big hy-hero-title">
              {hero.lines.map((line) => <span key={line}>{line}</span>)}
            </div>
            <p className="mt-4 max-w-[32rem] text-sm leading-relaxed text-mute md:mt-5 md:text-base">{hero.ko}</p>
            <ul className="hy-hero-services">
              {hero.services.map((service) => <li key={service}>{service}</li>)}
            </ul>
          </div>
          <p className="hy-scroll-label">아래로 스크롤 <span className="ml-1">↓</span></p>
        </div>
        <div className="hy-stage hy-seg0b">
          <div className="hy-big" data-big="B" />
          <p className="hy-caption">{hyper.stage1.ko}</p>
        </div>
        <div className="hy-stage hy-seg1">
          <div className="hy-rings">
            <svg viewBox="0 0 344 344">
              <defs>
                <clipPath id="hy-rc">
                  <polygon points="20,22 324,22 324,322 20,322" />
                </clipPath>
              </defs>
              <g clipPath="url(#hy-rc)" data-ring-g />
            </svg>
          </div>
          {hyper.says.map((s, i) => (
            <div key={s} className={`hy-say hy-s1${"abcd"[i]}`} data-stag={s} />
          ))}
        </div>
        <div className="hy-stage hy-seg3">
          <div className="hy-big" data-big="D" />
          <p className="hy-caption">{hyper.stage2.ko}</p>
        </div>
      </div>
    </section>
  );
}
