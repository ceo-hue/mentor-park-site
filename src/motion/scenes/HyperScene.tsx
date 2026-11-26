"use client";

/** 마우스를 따라다니는 굴절 렌즈와 하이퍼스페이스, ON AIR 신호 파동이 펼쳐지며 첫 상담 장면으로 이어지는 오프닝 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
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

/* ---------- ON AIR 신호 ----------
 * 방송 기호 ((•))처럼 가운데 신호점에서 좌우로 호가 퍼진다. 빛줄기와 같은 정면 원근.
 * 호는 스크롤을 따라 나아가고(멈추면 아주 천천히), 문구가 켜지면 그 문구 쪽으로 강조 신호가 한 번 날아간다. */
const ARCS = 6; // 한쪽의 기본 호 수
const ARC_R = 470; // 가장 바깥 호의 반지름 (viewBox 단위)
const ARC_SPAN = (36 * Math.PI) / 180; // 호의 반각
const PHRASE_SIDE = [1, 1, -1, -1]; // 문구 a·b는 오른쪽, c·d는 왼쪽
type SignalEls = {
  ambient: SVGPathElement[]; // [오른쪽 ARCS개, 왼쪽 ARCS개]
  accent: SVGPathElement[];
  trail: SVGPathElement[];
  core: SVGCircleElement;
  ring: SVGCircleElement;
};
const fract = (v: number) => v - Math.floor(v);
function setArc(el: SVGPathElement, side: number, r: number, alpha: number) {
  if (alpha <= 0.004 || r <= 0.02) {
    el.setAttribute("visibility", "hidden");
    return;
  }
  const R = r * ARC_R;
  const x = side * R * Math.cos(ARC_SPAN);
  const y = R * Math.sin(ARC_SPAN);
  el.setAttribute("visibility", "visible");
  el.setAttribute("d", `M${x.toFixed(2)} ${(-y).toFixed(2)}A${R.toFixed(2)} ${R.toFixed(2)} 0 0 ${side > 0 ? 1 : 0} ${x.toFixed(2)} ${y.toFixed(2)}`);
  el.setAttribute("stroke-opacity", alpha.toFixed(3));
}
function signalDraw(w: SignalEls, p: number, t: number, accentStart: number[], nowMs: number, motion: boolean) {
  // 기본 호: 스크롤 진행(p)으로 나아가고, 가만히 있어도 아주 천천히 흐른다. 바깥으로 갈수록 옅어진다
  const phase = motion ? p * 2.2 + t * 0.03 : 0.5;
  for (let k = 0; k < ARCS * 2; k++) {
    const side = k < ARCS ? 1 : -1;
    const i = k % ARCS;
    const r = fract(phase + i / ARCS);
    setArc(w.ambient[k], side, r, 0.7 * Math.pow(1 - r, 1.5) * smooth(r / 0.08));
  }
  // 강조 신호: 문구가 켜진 순간부터 1.5초 동안 그 문구 쪽으로. 뒤에 옅은 잔상 호가 따라간다
  w.accent.forEach((el, k) => {
    const start = accentStart[k];
    const age = start < 0 || !motion ? 2 : (nowMs - start) / 1500;
    if (age >= 1) {
      setArc(el, 1, 0, 0);
      setArc(w.trail[k], 1, 0, 0);
      return;
    }
    const r = 1 - Math.pow(1 - age, 3);
    const a = Math.pow(1 - age, 1.2);
    setArc(el, PHRASE_SIDE[k], r, a);
    setArc(w.trail[k], PHRASE_SIDE[k], Math.max(0, r - 0.05), a * 0.45);
  });
  // 신호점: 스크롤과 시간에 맞춰 은은하게 맥박
  const pulse = motion ? Math.sin(t * 3.2 + p * 12) * 0.5 + 0.5 : 0.5;
  w.core.setAttribute("r", (4.5 + pulse * 1.2).toFixed(2));
  w.ring.setAttribute("r", (11 + pulse * 3).toFixed(2));
  w.ring.setAttribute("stroke-opacity", (0.75 - pulse * 0.35).toFixed(3));
}

/**
 * 마우스를 따라다니는 굴절 렌즈 (보내 준 Refraction Glass Lens 셰이더 그대로).
 * 볼록 렌즈 곡면 + 미세한 물결 + RGB 분광 + 테두리 빛.
 * - uMode 0: 흰 첫 화면. 글자를 그린 캔버스를 렌즈 안에서만 휘어 불투명하게 덮고, 렌즈 밖은 투명 (원래 HTML 글자가 보인다)
 *            흰 바탕에서는 흰 테두리가 보이지 않아 테두리만 브랜드 파랑으로
 */
const LENS_VERT = "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}";
const LENS_FRAG = [
  "uniform sampler2D uTexture;uniform vec2 uMouse;uniform float uAspect,uTime,uRadius,uMode;uniform vec3 uRim;varying vec2 vUv;",
  "void main(){vec2 uv=vUv;vec2 st=vec2(uv.x*uAspect,uv.y);vec2 m=vec2(uMouse.x*uAspect,uMouse.y);",
  " float dist=distance(st,m);float radius=uRadius;",
  " if(radius>.001&&dist<radius){float nd=dist/radius;",
  "  float lensFactor=sin(nd*3.141592*.5);float ripple=sin(dist*40.-uTime*3.)*.015;float distortion=(1.-lensFactor)*.12+ripple;",
  "  vec2 dir=normalize(st-m+vec2(1e-5));vec2 duv=uv-dir*distortion;float co=.018*(1.-nd);",
  "  vec4 r=texture2D(uTexture,duv+dir*co);vec4 g=texture2D(uTexture,duv);vec4 b=texture2D(uTexture,duv-dir*co);",
  "  float rim=smoothstep(.85,1.,nd)*.3;",
  "  if(uMode<.5){float edge=1.-smoothstep(radius-.003,radius,dist);vec3 c=mix(vec3(r.r,g.g,b.b),uRim,rim*1.6);gl_FragColor=vec4(c*edge,edge);}",
  "  else{vec3 c=vec3(r.r,g.g,b.b)+vec3(rim);gl_FragColor=vec4(c,clamp(max(max(max(r.a,g.a),b.a),rim),0.,1.));}",
  " }else{gl_FragColor=uMode<.5?vec4(0.):texture2D(uTexture,uv);}",
  "}",
].join("\n");

const LENS_RADIUS = 0.14; // 화면 높이 대비 (원본 0.28의 절반)

export function HyperScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lensCanvasRef = useRef<HTMLCanvasElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const backdrop = backdropRef.current!;
    const canvas = canvasRef.current!;
    const lensCanvas = lensCanvasRef.current!;
    const stick = stickRef.current!;
    const washEl = washRef.current!;
    const problemWrap = document.getElementById("m-problem-wrap");
    const problemContent = document.querySelector<HTMLElement>("#m-problem > div");
    const motionOn = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stages = Array.from(stick.querySelectorAll<HTMLElement>(".hy-stage"));
    const bigA = stick.querySelector<HTMLElement>("[data-big='A']")!;
    const bigB = stick.querySelector<HTMLElement>("[data-big='B']")!;
    const bigD = stick.querySelector<HTMLElement>("[data-big='D']")!;
    const says = Array.from(stick.querySelectorAll<HTMLElement>(".hy-say"));
    const ringG = stick.querySelector<SVGGElement>("[data-ring-g]")!;
    const SVG_NS = "http://www.w3.org/2000/svg";
    const makeArc = (cls: string) => {
      const el = document.createElementNS(SVG_NS, "path");
      el.setAttribute("class", cls);
      el.setAttribute("visibility", "hidden");
      ringG.appendChild(el);
      return el;
    };
    const makeCircle = (cls: string) => {
      const el = document.createElementNS(SVG_NS, "circle");
      el.setAttribute("class", cls);
      return el;
    };
    const signal: SignalEls = {
      ambient: Array.from({ length: ARCS * 2 }, () => makeArc("arc")),
      trail: Array.from({ length: 4 }, () => makeArc("arc-trail")),
      accent: Array.from({ length: 4 }, () => makeArc("arc-accent")),
      ring: makeCircle("sig-ring"),
      core: makeCircle("sig-core"),
    };
    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("class", "sig-label");
    label.setAttribute("y", "36");
    label.setAttribute("text-anchor", "middle");
    label.textContent = "ON AIR";
    ringG.append(signal.ring, signal.core, label);
    const ringEls: Element[] = [...signal.ambient, ...signal.trail, ...signal.accent, signal.ring, signal.core, label];
    // 문구별 강조 신호가 시작된 시각 (-1이면 아직)
    const accentStart = [-1, -1, -1, -1];
    says.forEach((el) => buildStag(el, el.dataset.stag!, 0));

    /* ---------- WebGL ---------- */
    // 두 장의 캔버스: 글자 아래(빛줄기)와 글자 위(흰 첫 화면의 렌즈)
    let renderer: THREE.WebGLRenderer | null = null;
    let lensRenderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, powerPreference: "high-performance" });
      lensRenderer = new THREE.WebGLRenderer({ canvas: lensCanvas, alpha: true });
      renderer.autoClear = false;
      lensRenderer.autoClear = false;
    } catch {
      renderer = null;
      lensRenderer = null;
    }
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    let W = 1;
    let H = 1;
    let pr = 1;

    const lightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iRes: { value: new THREE.Vector3(1, 1, 1) },
        iTime: { value: 0 },
        uDur: { value: 2 },
        uOpacity: { value: 0 },
        uDark: { value: 1 },
        uPhase: { value: 0 },
        uCenter: { value: new THREE.Vector2() },
        uClip: { value: new THREE.Vector3(0, 0, -1) },
        uSA: { value: new THREE.Color("#83a9ed") },
        uSB: { value: new THREE.Color("#c695e9") },
      },
      vertexShader: LIGHT_VERT,
      fragmentShader: LIGHT_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const quad = () => new THREE.PlaneGeometry(2, 2);
    const light = new THREE.Mesh(quad(), lightMaterial);
    light.frustumCulled = false;
    const bgScene = new THREE.Scene();
    bgScene.add(light);

    const makeLens = (tex: THREE.Texture, mode: number) =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: tex },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: 1 },
          uTime: { value: 0 },
          uRadius: { value: 0 },
          uMode: { value: mode },
          uRim: { value: new THREE.Color("#4289d8") },
        },
        vertexShader: LENS_VERT,
        fragmentShader: LENS_FRAG,
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
      });
    // 흰 첫 화면: 글자를 같은 자리에 그린 캔버스를 렌즈 안에서만 휜다
    const textCanvas = document.createElement("canvas");
    const tctx = textCanvas.getContext("2d")!;
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const overlayMaterial = makeLens(textTexture, 0);
    const overlayMesh = new THREE.Mesh(quad(), overlayMaterial);
    overlayMesh.frustumCulled = false;
    const overlayScene = new THREE.Scene();
    overlayScene.add(overlayMesh);
    let textDrawnAt = 0;

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
      for (const r of [renderer, lensRenderer]) {
        if (!r) continue;
        r.setPixelRatio(pr);
        r.setSize(W, H, false);
      }
      lightMaterial.uniforms.iRes.value.set(W * pr, H * pr, 1);
      lightMaterial.uniforms.uCenter.value.set((W * pr) / 2, (H * pr) / 2);
      textCanvas.width = Math.max(2, Math.floor(W * pr));
      textCanvas.height = Math.max(2, Math.floor(H * pr));
      textDrawnAt = 0;
    };

    /* 첫 화면 글자를 캔버스에 같은 자리로 그린다 (렌즈가 휠 대상) */
    const stageA = stick.querySelector<HTMLElement>(".hy-seg0a")!;
    const range = document.createRange();
    const ascentCache = new Map<string, number>();
    const opacityUpTo = (el: Element | null) => {
      let a = 1;
      for (let e = el; e && e !== stick; e = e.parentElement) a *= Number(getComputedStyle(e).opacity) || 0;
      return a;
    };
    const drawText = () => {
      const sr = stick.getBoundingClientRect();
      tctx.setTransform(pr, 0, 0, pr, 0, 0);
      // 바탕: 페이지 색 위에 흰 카드 (첫 화면의 카드 틀과 같은 여백)
      tctx.globalAlpha = 1;
      tctx.fillStyle = "#f6f8ff";
      tctx.fillRect(0, 0, W, H);
      const top = clamp(H * 0.1, 65.6, 96);
      const side = clamp(W * 0.042, 12, 64);
      tctx.fillStyle = "#ffffff";
      tctx.beginPath();
      tctx.roundRect(side, top, W - side * 2, H - top - 32, 32);
      tctx.fill();
      // 서비스 칩
      stageA.querySelectorAll("li").forEach((li) => {
        const r = li.getBoundingClientRect();
        const cs = getComputedStyle(li);
        tctx.globalAlpha = opacityUpTo(li);
        tctx.beginPath();
        tctx.roundRect(r.left - sr.left + 0.5, r.top - sr.top + 0.5, r.width - 1, r.height - 1, r.height / 2);
        tctx.fillStyle = cs.backgroundColor;
        tctx.fill();
        tctx.strokeStyle = cs.borderTopColor;
        tctx.lineWidth = 1;
        tctx.stroke();
      });
      // 글자: 한 글자씩 실제 화면 위치에
      const walker = document.createTreeWalker(stageA, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.textContent ?? "";
        const parent = n.parentElement;
        if (!parent || !text.trim() || parent.closest(".sr-only")) continue;
        const alpha = opacityUpTo(parent);
        if (alpha < 0.02) continue;
        const cs = getComputedStyle(parent);
        const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        tctx.font = font;
        (tctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
        let ascent = ascentCache.get(font);
        if (ascent === undefined) {
          const m = tctx.measureText("가Hg");
          ascent = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.9;
          ascentCache.set(font, ascent);
        }
        tctx.globalAlpha = alpha;
        tctx.fillStyle = cs.color;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch.trim() === "") continue;
          range.setStart(n, i);
          range.setEnd(n, i + 1);
          const r = range.getBoundingClientRect();
          if (!r.width) continue;
          tctx.fillText(ch, r.left - sr.left, r.top - sr.top + ascent);
        }
      }
      tctx.globalAlpha = 1;
      textTexture.needsUpdate = true;
    };

    resize();
    // 겹침 여백이 바뀌었으니 뒤 장면들의 고정 위치를 다시 계산
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener("resize", resize);

    // 렌즈는 마우스가 있는 기기에서만
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const pointer = { x: 0, y: 0, inside: false };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
    };
    const onLeave = () => (pointer.inside = false);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

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
        accentStart.fill(-1);
        curStage = -1;
        revealed = false;
        return;
      }
      const play = i >= -vh * 0.2;
      if (st !== curStage || (play !== revealed && (st === 0 || st === 1))) {
        const changed = st !== curStage;
        curStage = st;
        stages.forEach((s, k) => s.classList.toggle("on", k === st));
        if (st !== 2) {
          says.forEach((s) => s.classList.remove("play"));
          accentStart.fill(-1);
        }
        if (st === 0 || st === 1) {
          const host = st === 0 ? bigA : bigB;
          if (play) fillBig(host, st === 0 ? bigLines.A : bigLines.B);
          else host.textContent = "";
        } else if (st === 3 && changed) fillBig(bigD, bigLines.D);
        revealed = play;
      }
      if (st === 2) {
        // 고리 구간(2.4~4화면) 안에서 문구 네 개가 차례로 켜진다
        const p = clamp((i - 2.4 * vh) / (1.6 * vh), 0, 1);
        says.forEach((el, k) => {
          const on = p >= 0.04 + k * 0.22;
          if (on !== el.classList.contains("play")) {
            el.classList.toggle("play", on);
            accentStart[k] = on ? performance.now() : -1;
          }
        });
        signalDraw(signal, p, performance.now() / 1000, accentStart, performance.now(), motionOn);
      }
    };

    /* ---------- 프레임 ---------- */
    let mainDrawn = false;
    let lensDrawn = false;
    let lastNight = -1;
    let revealR = 0; // 검은 원의 반지름(px). 빛줄기는 이 원 안에만
    const origin = { x: 0, y: 0 }; // 검은 원이 퍼지는 점: 반전이 시작될 때의 렌즈 위치에서 고정
    const lensUV = new THREE.Vector2(0.5, 0.5);
    let lensVis = 0;
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
      // 5.9~6.25화면: 마지막 문구가 사라진다
      const textFade = motionOn ? smooth((u - 5.9) / 0.35) : Number(u > 6.1);
      // 6.3~6.75화면: 검은 공간이 페이지의 밝은 톤으로 바뀐다. 중간의 회색 구간은 짧게 지나가도록 가운데를 가파르게
      const wash = motionOn ? smooth(smooth((u - 6.3) / 0.45)) : Number(u > 6.6);
      // 6.9~7.2화면: 무대가 사라지며 같은 톤 아래의 두 번째 페이지가 제자리에서 드러난다
      const leave = motionOn ? smooth((u - 6.9) / 0.3) : Number(u > 7);
      const onScreen = rect.bottom > 0 && hyTop < vh;

      // 렌즈: 마우스를 부드럽게 따라간다 (원본의 lerp 0.08)
      const sr = stick.getBoundingClientRect();
      const want = canHover && motionOn && pointer.inside && onScreen ? 1 : 0;
      lensVis = damp(lensVis, want, 6, dt);
      if (pointer.inside) {
        lensUV.x += ((pointer.x - sr.left) / W - lensUV.x) * 0.08;
        lensUV.y += (1 - (pointer.y - sr.top) / H - lensUV.y) * 0.08;
      }

      // 검은 원이 퍼지는 점: 반전 전에는 렌즈 위치(렌즈가 없으면 오른쪽 자리), 반전이 시작되면 고정
      if (flip <= 0) {
        const desktop = W >= 768;
        if (lensVis > 0.5) {
          origin.x = lensUV.x * W;
          origin.y = (1 - lensUV.y) * vh;
        } else {
          origin.x = W * (desktop ? 0.785 : 0.68);
          origin.y = vh * (desktop ? 0.5 : 0.74);
        }
      }
      const farthest = Math.max(
        Math.hypot(origin.x, origin.y),
        Math.hypot(W - origin.x, origin.y),
        Math.hypot(origin.x, vh - origin.y),
        Math.hypot(W - origin.x, vh - origin.y)
      );
      if (flip !== lastNight) {
        lastNight = flip;
        // 카드 틀이 열리는 것도 같은 순간에
        backdrop.style.setProperty("--open-frame", String(1 - flip));
        // 검은색은 투명도로 서서히가 아니라 한 점에서 원으로 퍼진다
        revealR = flip <= 0 ? 0 : lerp(0, farthest + 8, flip);
        backdrop.style.setProperty("--reveal-r", `${revealR}px`);
        backdrop.style.setProperty("--reveal-x", `${origin.x}px`);
        backdrop.style.setProperty("--reveal-y", `${origin.y}px`);
      }

      // 톤 전환과 무대 퇴장
      if (wash !== lastCurtain) {
        lastCurtain = wash;
        washEl.style.opacity = String(wash);
      }
      stick.style.opacity = leave > 0 ? String(1 - leave) : "";
      if (textFade > 0) stick.style.setProperty("--stage-fade", String(1 - textFade));
      else stick.style.removeProperty("--stage-fade");
      section.style.pointerEvents = leave >= 1 ? "none" : "";
      const covered = wash >= 1; // 밝은 톤이 다 덮으면 그리지 않는다
      // 톤이 바뀌는 동안 두 번째 페이지는 위로 밀려 올라오지 않고 제자리에 머문다
      if (problemContent) {
        const pTop = problemWrap ? problemWrap.getBoundingClientRect().top : 0;
        if (wash > 0 && pTop > 0) problemContent.style.transform = `translateY(${-pTop}px)`;
        else if (problemContent.style.transform) problemContent.style.transform = "";
      }
      // 원이 왼쪽 제목까지 덮은 뒤에 글자를 흰색으로, 밝은 톤으로 바뀌기 시작하면 다시 어둡게
      const dark = flip > 0.8 && wash < 0.5 && rect.bottom > 0 && hyTop < vh * 0.5;
      stick.classList.toggle("on-dark", dark);
      if (dark !== wasDark) {
        wasDark = dark;
        window.dispatchEvent(new CustomEvent("hyper-dark", { detail: dark }));
      }

      const t = now / 1000;
      const aspect = W / vh;

      // 1) 글자 아래: 검은 구간의 빛줄기 (렌즈는 반전과 함께 사라지므로 여기에는 없다)
      // 신호 파동 구간(2.4~4화면)에는 빛줄기를 낮춰 파동이 주인공이 되게
      const waveStage = smooth((u - 2.25) / 0.3) * (1 - smooth((u - 3.85) / 0.3));
      const lightOpacity = smooth((flip - 0.5) / 0.5) * (1 - wash) * (1 - waveStage * 0.6);
      if (renderer && onScreen && !covered && lightOpacity > 0) {
        lightMaterial.uniforms.uOpacity.value = lightOpacity;
        // 원이 화면을 다 덮기 전에는 흰 면 위로 줄기가 새지 않게 원 안으로 자른다
        lightMaterial.uniforms.uClip.value.set(origin.x * pr, (vh - origin.y) * pr, revealR >= farthest ? -1 : revealR * pr);
        lightMaterial.uniforms.iTime.value = 2 * clamp((vh - hyTop) / (rect.height + vh), 0, 1);
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(bgScene, camera);
        mainDrawn = true;
      } else if (mainDrawn && renderer) {
        renderer.clear();
        mainDrawn = false;
      }

      // 2) 글자 위: 흰 첫 화면에서만 렌즈 안쪽 글자를 휘어 덮는다. 스크롤로 반전이 시작되면 렌즈가 오므라들며 사라진다
      const overlayR = LENS_RADIUS * lensVis * (1 - smooth(flip / 0.25));
      if (lensRenderer && onScreen && overlayR > 0.002 && u < 1) {
        if (now - textDrawnAt > 90) {
          textDrawnAt = now;
          drawText();
        }
        const ou = overlayMaterial.uniforms;
        ou.uMouse.value.copy(lensUV);
        ou.uAspect.value = aspect;
        ou.uTime.value = t;
        ou.uRadius.value = overlayR;
        lensRenderer.setClearColor(0x000000, 0);
        lensRenderer.clear();
        lensRenderer.render(overlayScene, camera);
        lensDrawn = true;
      } else if (lensDrawn && lensRenderer) {
        lensRenderer.clear();
        lensDrawn = false;
      }
      updateHyper(rect, vh);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      backdrop.style.removeProperty("--open-frame");
      if (problemWrap) problemWrap.style.marginTop = "";
      if (problemContent) problemContent.style.transform = "";
      stick.style.opacity = "";
      section.style.pointerEvents = "";
      backdrop.style.removeProperty("--reveal-r");
      backdrop.style.removeProperty("--reveal-x");
      backdrop.style.removeProperty("--reveal-y");
      window.dispatchEvent(new CustomEvent("hyper-dark", { detail: false }));
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      [light, overlayMesh].forEach((m) => m.geometry.dispose());
      lightMaterial.dispose();
      overlayMaterial.dispose();
      textTexture.dispose();
      renderer?.dispose();
      lensRenderer?.dispose();
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
            <svg viewBox="-500 -200 1000 400">
              <g data-ring-g />
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
        {/* 흰 첫 화면의 렌즈: 글자 위에 겹쳐 렌즈 안쪽만 휜 글자를 보여 준다 */}
        <canvas ref={lensCanvasRef} className="hy-lens" />
        {/* 마지막 문구가 사라진 뒤 무대 전체를 페이지의 밝은 톤으로 바꾸는 층 */}
        <div ref={washRef} className="hy-wash" />
      </div>
    </section>
  );
}
