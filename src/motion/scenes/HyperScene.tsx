"use client";

/**
 * 하이퍼스페이스 — NoraVale 글래스 스크롤 데모(C:\리버스엔지니어링\결과물\2026-11-05_NoraVale_글래스스크롤)의
 * 'BUILD WITH CARE' 구간을 그대로 이식했다. 바꾼 것은 도형(화살표 → 행성 구체 + 고리)과 문구, 색뿐이다.
 *
 *  - 8화면 높이 섹션 + 안쪽 sticky 무대. 단계 = floor(섹션 안 스크롤 / 화면높이) → 0~1, 2~3, 4~5, 6~7
 *  - 도형: 섹션 위쪽이 화면 가운데를 지나 한 화면 오르는 동안 rest → max로 커지고(damp k=32),
 *          마지막 한 화면 동안 다시 rest로 줄며, 들어올 때 180°, 나갈 때 180° 돈다
 *  - 셰이더: 화면 좌표 극좌표 줄무늬. 진행(t)에 따라 줄 수·속도·길이가 늘고, 줄마다 색이 흔들린다.
 *          reveal이 커질수록 강조색 → 검정, 정반사·프레넬 포함
 *  - 글자: 문자열 해시 시드(FNV-1a + mulberry32)로 정한 순서대로 0.23초씩 켜진다
 *  - 고리 7개: 구를 가로로 자른 단면처럼 위에서 들어와 아래로 흐른다
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LOGO } from "@/lib/logo";
import { hero, hyper } from "../content";

/* ---------- 원본과 같은 수학 도우미 ---------- */
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

/* ---------- 줄무늬 셰이더 (원본 hyMat) ---------- */
const VERT =
  "varying vec3 vN,vE;void main(){vec4 wp=modelMatrix*vec4(position,1.);gl_Position=projectionMatrix*viewMatrix*wp;vN=normalize(mat3(modelMatrix)*normal);vE=normalize(wp.xyz-cameraPosition);}";
const FRAG = [
  "uniform vec3 iRes;uniform float iTime,uDur,uReveal;uniform vec3 uAccent,uSA,uSB,uLight;varying vec3 vN,vE;",
  "float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}",
  "vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.,-1./3.,2./3.,-1.);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1e-10;return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);}",
  "vec3 hsv2rgb(vec3 c){vec4 K=vec4(1.,2./3.,1./3.,3.);vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);}",
  "vec3 hyper(vec2 fc){vec2 R=iRes.xy;float bs=max(1.,min(R.x,R.y));vec2 u=(fc*2.-R)/bs;float t=clamp(clamp(iTime,0.,uDur)/uDur,0.,1.);float time=t*uDur;",
  " const float cd=100.;vec2 polar=vec2(atan(u.y,u.x)/3.,length(u));float ac=(6.-polar.x)*cd;float aid=floor(ac)+.5;float acell=abs(fract(ac)-.5);float rc=(6.-polar.y)*cd;vec2 q=vec2(aid,rc);",
  " float travel=smoothstep(0.,1.,t);float keepP=mix(.18,1.,travel);float speed=mix(.7,3.6,travel);float trail=mix(2.7,.975,travel);",
  " float seq=fract((aid+.5)*.61803398875);float keep=1.-smoothstep(keepP-.025,keepP+.025,seq);",
  " float pb=(q.y*.02+q.x*.4)*fract(q.x*.61);vec4 sp=max(1.-fract(vec4(7.,6.,4.,0.)*.02+pb+time*speed)*trail,0.);",
  " float ch=max(max(sp.r,sp.g),sp.b);float edge=max(fwidth(ch)*1.5,2./max(iRes.y,1.));float star=smoothstep(.12-edge,.12+edge,ch);",
  " float te=max(fwidth(acell)*1.5,.002);float thin=1.-smoothstep(.13-te,.13+te,acell);star*=thin*keep;",
  " float rb=pow(smoothstep(.1,1.,polar.y),1.25);float inten=mix(0.,3.4,t*1.2);",
  " float sb=h21(vec2(aid,19.713));vec3 srgb=mix(uSA,uSB,sb);vec3 ha=rgb2hsv(max(uSA,vec3(1e-5))),hb=rgb2hsv(max(uSB,vec3(1e-5)));float dh=abs(ha.x-hb.x);dh=min(dh,1.-dh);float band=clamp(dh*1.25+.04,.05,.13);",
  " vec3 hsv=rgb2hsv(max(srgb,vec3(1e-5)));float i1=h21(vec2(aid,6.18)),i2=h21(vec2(aid,91.7));float ph=time*speed;",
  " hsv.x=fract(hsv.x+(i1-.5)*band*2.+sin(ph*.52+aid*.29+i1*6.2831853)*(band*.85));hsv.y=clamp(hsv.y*mix(.96,1.06,i2),0.,1.);hsv.z=clamp(hsv.z*mix(.97,1.05,i1),0.,1.);",
  " vec3 sc=hsv2rgb(hsv)*mix(.78,1.,smoothstep(.14,.5,ch));return inten*rb*sc*star;}",
  "float spec(vec3 light,vec3 n,vec3 e){vec3 l=normalize(-light);vec3 h=normalize(e+l);return pow(abs(dot(n,h)),40.)+max(0.,dot(n,l))*.1;}",
  "void main(){vec3 stripes=hyper(gl_FragCoord.xy);float rv=clamp(uReveal,0.,1.);float luma=dot(stripes,vec3(.299,.587,.114));",
  " float dk=smoothstep(0.,.88,rv);vec3 base=mix(uAccent,vec3(0.),dk);float gap=(1.-smoothstep(.035,.12,luma))*rv;float guard=1.-smoothstep(.68,.94,rv);",
  " vec3 rgb=base+stripes*rv+uAccent*gap*.07*guard;vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;vec3 e=normalize(vE);",
  " float gm=mix(1.,smoothstep(.1,.48,luma),rv);rgb+=spec(uLight,n,e)*1.2*gm;",
  " float f=pow(1.-abs(dot(e,n)),6.);rgb+=f*smoothstep(-.5,.5,dot(n,normalize(vec3(-1.,.3,1.))))*gm;gl_FragColor=vec4(rgb,1.);}",
].join("\n");

export function HyperScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const stick = stickRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionOn = !reduce;

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
    const hyMat = new THREE.ShaderMaterial({
      uniforms: {
        iRes: { value: new THREE.Vector3(1, 1, 1) },
        iTime: { value: 0 },
        uDur: { value: 2 },
        uReveal: { value: 0 },
        uAccent: { value: new THREE.Color(LOGO.color) },
        uSA: { value: new THREE.Color("#5b8cff") },
        uSB: { value: new THREE.Color("#c06bff") },
        uLight,
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
    });

    // 도형: 행성 구체 + 기울어진 고리 (명함 측정값)
    const hy = new THREE.Group();
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), hyMat);
    const ringWrap = new THREE.Group();
    ringWrap.rotation.z = LOGO.ringRoll;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LOGO.ringRadius, LOGO.stroke * 1.6, 24, 220), hyMat);
    ring.rotation.x = LOGO.ringTilt;
    ringWrap.add(ring);
    hy.add(planet, ringWrap);
    [planet, ring].forEach((m) => (m.frustumCulled = false));
    hy.visible = false;
    scene.add(hy);
    const HY_HEIGHT = 2; // 구체 지름 (rest 크기의 기준)
    const HY_RADIUS = 1;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      pr = Math.min(window.devicePixelRatio || 1, 2);
      section.style.height = `${H * 8}px`;
      if (renderer) {
        renderer.setPixelRatio(pr);
        renderer.setSize(W, H, false);
      }
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      hyMat.uniforms.iRes.value.set(W * pr, H * pr, 1);
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { nx: 0, ny: 0, inside: false };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.inside = true;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ---------- 단계 상태 기계 (원본 updateHyper) ---------- */
    const bigLines = { A: hero.lines, B: hyper.stage1, D: hyper.stage2 };
    let curStage = -1;
    let revealed = false;
    let wasWhite = false;
    const stageIdx = (i: number) => (i <= 1 ? 0 : i <= 3 ? 1 : i <= 5 ? 2 : 3);
    const setWhite = (on: boolean) => {
      stick.classList.toggle("white", on);
      if (on !== wasWhite) {
        wasWhite = on;
        window.dispatchEvent(new CustomEvent("hyper-dark", { detail: on }));
      }
    };
    const updateHyper = (reveal: number) => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const i = -rect.top;
      const idx = clamp(Math.floor(Math.max(0, i) / vh), 0, 7);
      const st = stageIdx(idx);
      const inside = i > -vh * 0.5 && i < rect.height + vh * 0.5;
      if (!inside) {
        stages.forEach((s) => s.classList.remove("on"));
        says.forEach((s) => s.classList.remove("play"));
        curStage = -1;
        revealed = false;
        setWhite(false);
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
      if (st === 2) ringsDraw(ringEls, clamp((i - 4 * vh) / (2 * vh), 0, 1));
      // 원본은 0.55(어두운 테마의 흰 글자). 밝은 테마의 검은 글자는 파란 바탕에서 일찍 흰색으로 바꾼다
      setWhite(reveal > 0.3);
    };

    /* ---------- 프레임 (원본 frame의 하이퍼스페이스 부분) ---------- */
    const camOff = new THREE.Vector2();
    const camTar = new THREE.Vector2();
    let hyScale = 0;
    let hyInit = false;
    let drawn = false;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
      last = now;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const hyTop = rect.top;
      const hyH = rect.height;
      const n = 120;
      const cy = vh / 2;
      let reveal = 0;
      const vis = hyTop < vh + vh * 0.5 && hyTop + hyH > -vh * 0.5;
      hy.visible = vis;

      if (vis) {
        if (motionOn && pointer.inside && !isMobile()) camTar.set(pointer.nx * 0.9, pointer.ny * 0.55);
        else camTar.set(0, 0);
        camOff.lerp(camTar, motionOn ? 0.06 : 1);
        camera.position.set(camOff.x, camOff.y, CAMZ);
        camera.lookAt(0, 0, 0);
        uLight.value.set(pointer.nx * 10, pointer.ny * 8 + 4, 0.5);

        const zH = -3;
        const wH = worldH(zH);
        const wW = worldW(zH);
        const rest = (140 * wH) / vh / HY_HEIGHT;
        const maxS = (Math.hypot(wW, wH) * 2.1) / (HY_RADIUS * 2);
        // 사이트 첫 장면: 처음 0.3화면은 작게 머물며 타이틀을 보여 준 뒤 한 화면 동안 커진다
        const grow = smooth((-hyTop - vh * 0.3) / vh);
        const D = cy + n - hyH;
        const N = Math.min(vh, D + vh);
        const top = hyTop;
        const bottom = hyTop + hyH;
        const shr = top <= D ? 1 : top >= N ? 0 : 1 - smooth((top - D) / (N - D));
        const before = top > N;
        const shrinking = top <= N && top > D;
        const eE = lerp(rest, maxS, grow);
        const target = before ? eE : shrinking ? lerp(eE, rest, shr) : rest;
        if (!hyInit || !motionOn) {
          hyScale = target;
          hyInit = true;
        } else hyScale = damp(hyScale, target, 32, dt);
        hy.scale.setScalar(hyScale);
        reveal = clamp((hyScale - rest) / Math.max(maxS - rest, 1e-6), 0, 1);
        const yPx = before ? Math.max(cy, top + n) : shrinking ? cy : Math.min(cy, bottom - n);
        hy.position.set(0, (0.5 - yPx / vh) * wH, zH);
        const spin = rad(180);
        let sr: number;
        if (shrinking) sr = spin + clamp((shr - 0.6) / 0.4, 0, 1) * spin;
        else if (before) sr = clamp(reveal / 0.4, 0, 1) * spin;
        else sr = spin * 2;
        hy.rotation.set(0, sr, 0);
        hyMat.uniforms.uReveal.value = reveal;
        hyMat.uniforms.iTime.value = 2 * clamp((vh - top) / (hyH + vh), 0, 1);

        if (renderer) {
          renderer.setClearColor(0x000000, 0);
          renderer.clear();
          renderer.render(scene, camera);
          drawn = true;
        }
      } else if (drawn && renderer) {
        renderer.clear();
        drawn = false;
      }
      updateHyper(reveal);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.dispatchEvent(new CustomEvent("hyper-dark", { detail: false }));
      planet.geometry.dispose();
      ring.geometry.dispose();
      hyMat.dispose();
      renderer?.dispose();
      ringEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <section
      id="m-intro"
      ref={sectionRef}
      aria-label={`${hero.lines.join(" ")} ${hero.ko} ${hyper.stage1.join(" ")}, ${hyper.says.map((s) => s.replace(/\|/g, " ")).join(" ")} ${hyper.stage2.join(" ")}`}
      className="relative h-[800svh]"
    >
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[5] h-full w-full" aria-hidden="true" />
      <div ref={stickRef} className="hy-stick" aria-hidden="true">
        <div className="hy-stage hy-seg0a">
          <p className="col-span-full row-start-1 self-end text-center font-mono text-[11px] tracking-[0.3em] uppercase text-planet md:text-xs">
            {hero.kicker}
          </p>
          <div className="hy-big" data-big="A" />
          <p className="col-span-full row-start-6 mx-auto max-w-xl self-start text-center text-sm leading-relaxed opacity-80 md:text-base">
            {hero.ko}
          </p>
          <p className="col-span-full row-start-6 self-end justify-self-center font-mono text-[10px] tracking-[0.3em] opacity-60">
            SCROLL ↓
          </p>
        </div>
        <div className="hy-stage hy-seg0b">
          <div className="hy-big" data-big="B" />
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
        </div>
      </div>
    </section>
  );
}
