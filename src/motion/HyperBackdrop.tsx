"use client";

/**
 * 첫 화면의 하이퍼스페이스 빛줄기를 배경으로 깐다 (로고 행성은 없다).
 * 스크롤하는 동안에는 빛줄기가 빨라지고 길어지며, 멈추면 천천히 흐른다.
 * 부모 요소를 꽉 채우고, 화면 높이만큼 sticky로 붙어 있는다.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LIGHT_FRAG, LIGHT_VERT } from "./hyperShader";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));

type Props = {
  /** 빛줄기 중심 (화면 폭·높이 대비). 데스크톱 / 모바일 */
  center?: { desktop: [number, number]; mobile: [number, number] };
  /** 0: 흰 바탕용 옅은 푸른색, 1: 남색 바탕용 밝은 색 */
  dark?: number;
  opacity?: number;
  className?: string;
};

export function HyperBackdrop({
  center = { desktop: [0.74, 0.5], mobile: [0.5, 0.62] },
  dark = 0,
  opacity = 0.75,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cfg = useRef({ center, dark, opacity });
  cfg.current = { center, dark, opacity };

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const motionOn = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // WebGL이 없으면 배경 없이
    }
    const camera = new THREE.Camera();
    const scene = new THREE.Scene();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iRes: { value: new THREE.Vector3(1, 1, 1) },
        iTime: { value: 1 },
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
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    scene.add(quad);

    let W = 1;
    let H = 1;
    let pr = 1;
    // 캔버스 상자 크기(100lvh, 주소창과 무관)를 그대로 쓴다. 주소창만 움직인 resize는 건너뛴다
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (w === W && h === H) return;
      W = w;
      H = h;
      pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
      renderer.setSize(W, H, false);
      material.uniforms.iRes.value.set(W * pr, H * pr, 1);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastY = window.scrollY;
    let last = performance.now();
    let warp = 0; // 0 ~ 1, 스크롤 속도
    let fade = 0;
    let phase = 0;
    let drawn = false;
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
      last = now;
      const y = window.scrollY;
      const vel = Math.abs(y - lastY) / dt;
      lastY = y;

      const r = wrap.getBoundingClientRect();
      const VH = window.innerHeight; // 지금 실제로 보이는 높이 (켜짐·꺼짐 판단용)
      const onScreen = r.bottom > 0 && r.top < VH;
      if (!onScreen) {
        if (drawn) {
          renderer.clear();
          drawn = false;
        }
        fade = 0;
        return;
      }

      const { center: c, dark: d, opacity: o } = cfg.current;
      const [cx, cy] = W >= 768 ? c.desktop : c.mobile;
      // 섹션이 화면에 들어올수록 서서히 켜진다
      const visible = clamp(Math.min(VH - r.top, r.bottom) / (VH * 0.6), 0, 1);
      fade = motionOn ? damp(fade, visible, 6, dt) : visible;
      warp = motionOn ? damp(warp, clamp(vel / (H * 1.6), 0, 1), vel > 0 ? 5 : 2.2, dt) : 0;
      // 줄기의 위치는 누적값으로만 움직인다: 스크롤 속도는 '얼마나 빨리' 나아가는지만 바꾸고 방향은 늘 바깥쪽
      phase += motionOn ? dt * (0.12 + warp * 1.6) : 0;

      const u = material.uniforms;
      u.uCenter.value.set(W * cx * pr, H * (1 - cy) * pr);
      u.iTime.value = 1.2; // 줄기 밀도·세기는 고정 (이 값이 바뀌면 줄기가 뒤로 밀리는 것처럼 보인다)
      u.uPhase.value = phase;
      u.uDark.value = d;
      u.uOpacity.value = o * fade * (0.85 + warp * 0.3);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, camera);
      drawn = true;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="hyper-backdrop-stick sticky top-0 w-full overflow-hidden">
        <canvas ref={canvasRef} className="hyper-backdrop-canvas block h-full w-full" />
      </div>
    </div>
  );
}
