"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { LOGO } from "@/lib/logo";
import { emit, explodeAmount, now, scene } from "@/lib/sceneStore";
import { brand, orbit } from "@/content/site";

/* ------------------------------------------------------------------ */
/* 섹션별 행성 자세. x·y는 화면 폭·높이 대비, s는 기본 크기 배수        */
/* ------------------------------------------------------------------ */
type Pose = { x: number; y: number; s: number; align: number; spin: number };
const POSES_WIDE: Pose[] = [
  { x: 0.0, y: 0.09, s: 0.9, align: 0, spin: 0 }, // manifesto: 거대 워드마크 앞 중앙
  { x: 0.0, y: 0.08, s: 0.72, align: 0, spin: 0.2 }, // hold
  { x: 0.24, y: 0.0, s: 0.85, align: 1, spin: 0.4 }, // orbit
  { x: 0.36, y: 0.3, s: 0.38, align: 0.3, spin: 0.6 }, // proof
  { x: -0.26, y: 0.04, s: 0.62, align: 0, spin: 0.8 }, // person
  { x: 0.0, y: -0.56, s: 1.5, align: 0, spin: 1.0 }, // contact
];
const POSES_NARROW: Pose[] = [
  { x: 0, y: 0.14, s: 0.95, align: 0, spin: 0 },
  { x: 0, y: 0.13, s: 0.75, align: 0, spin: 0.2 },
  { x: 0.18, y: 0.36, s: 0.42, align: 1, spin: 0.4 },
  { x: 0.28, y: 0.4, s: 0.3, align: 0.3, spin: 0.6 },
  { x: 0, y: 0.3, s: 0.5, align: 0, spin: 0.8 },
  { x: 0, y: -0.48, s: 1.3, align: 0, spin: 1.0 },
];

const smooth = (x: number) => x * x * (3 - 2 * x);
function poseAt(poses: Pose[], t: number): Pose {
  const i = Math.max(0, Math.min(poses.length - 1, Math.floor(t)));
  const j = Math.min(poses.length - 1, i + 1);
  const f = smooth(Math.min(1, Math.max(0, t - i)));
  const a = poses[i];
  const b = poses[j];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    s: a.s + (b.s - a.s) * f,
    align: a.align + (b.align - a.align) * f,
    spin: a.spin + (b.spin - a.spin) * f,
  };
}

/** 커스터마이저 색을 부드럽게 따라가는 공용 강조색 */
const accent = new THREE.Color(LOGO.color);
const accentTarget = new THREE.Color(LOGO.color);
const WHITE = new THREE.Color("#ffffff");

/* ------------------------------------------------------------------ */
/* 배경: 파스텔 그라데이션 + 움직이는 빛 + 도트 매트릭스                 */
/* 유리 행성이 이 배경을 굴절시키므로 CSS가 아니라 장면 안에 둔다        */
/* ------------------------------------------------------------------ */
function Backdrop() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { camera, viewport } = useThree();
  const z = -9;
  const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, z));
  useFrame((state) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value = scene.progress;
    u.uDpr.value = state.gl.getPixelRatio();
    (u.uAccent.value as THREE.Color).copy(accent);
  });
  return (
    <mesh position={[0, 0, z]} renderOrder={-10}>
      <planeGeometry args={[vp.width * 1.3, vp.height * 1.3]} />
      <shaderMaterial
        ref={mat}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uDpr: { value: 1 },
          uAccent: { value: new THREE.Color(LOGO.color) },
        }}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={/* glsl */ `
          uniform float uTime; uniform float uScroll; uniform float uDpr; uniform vec3 uAccent;
          varying vec2 vUv;
          void main() {
            vec3 top = vec3(0.965, 0.973, 1.0);
            vec3 bot = vec3(0.78, 0.84, 0.98);
            float y = vUv.y + uScroll * 0.25;
            vec3 col = mix(bot, top, smoothstep(0.0, 1.0, y));
            // 떠다니는 빛 덩어리 두 개 (라벤더, 강조색)
            vec2 p1 = vec2(0.25 + 0.08 * sin(uTime * 0.15), 0.6 + 0.1 * cos(uTime * 0.11) - uScroll * 0.4);
            vec2 p2 = vec2(0.78 + 0.07 * cos(uTime * 0.13), 0.35 + 0.08 * sin(uTime * 0.17) + uScroll * 0.3);
            col = mix(col, vec3(0.93, 0.85, 1.0), 0.55 * smoothstep(0.45, 0.0, distance(vUv, p1)));
            col = mix(col, mix(uAccent, vec3(1.0), 0.55), 0.45 * smoothstep(0.4, 0.0, distance(vUv, p2)));
            // 도트 매트릭스
            float cell = 7.0 * uDpr;
            vec2 g = mod(gl_FragCoord.xy, cell) - cell * 0.5;
            float dot = smoothstep(1.25 * uDpr, 0.6 * uDpr, length(g));
            col *= 1.0 - dot * 0.09;
            gl_FragColor = vec4(col, 1.0);
          }`}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* 거대 워드마크: 행성 뒤에 놓여 유리를 통해 굴절되어 보인다             */
/* ------------------------------------------------------------------ */
function useWordmarkTexture() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let alive = true;
    const fam =
      getComputedStyle(document.documentElement).getPropertyValue("--font-anton").trim() || "Impact";
    const draw = () => {
      if (!alive) return;
      const W = 2600;
      const H = 1500;
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d")!;
      const [l1, l2] = brand.nameEn.split(" ");
      let size = 900;
      ctx.font = `400 ${size}px ${fam}`;
      const widest = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width);
      size = Math.floor((size * (W * 0.98)) / widest);
      ctx.font = `400 ${size}px ${fam}`;
      ctx.fillStyle = "#0a0f1c";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lh = size * 0.86;
      ctx.fillText(l1, W / 2, H / 2 - lh / 2);
      ctx.fillText(l2, W / 2, H / 2 + lh / 2);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
    };
    document.fonts.load(`400 200px ${fam}`).then(draw, draw);
    return () => {
      alive = false;
    };
  }, []);
  return tex;
}

function Wordmark() {
  const tex = useWordmarkTexture();
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const { camera, viewport } = useThree();
  const z = -1.6;
  const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, z));
  const wide = viewport.aspect > 1.05;
  // 폭과 높이 모두에 맞춰 화면 안에 들어오게 (데스크톱은 높이의 54% 이내)
  const w = Math.min(vp.width * (wide ? 0.8 : 0.96), ((vp.height * (wide ? 0.54 : 0.4)) * 2600) / 1500);
  const h = (w * 1500) / 2600;
  useFrame((_, delta) => {
    if (!ref.current || !mat.current) return;
    const t = Math.min(scene.t, 1.5);
    const baseY = wide ? vp.height * 0.09 : vp.height * 0.14;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, baseY + t * vp.height * 0.9, 5, delta);
    const intro = scene.started ? 1 : 0;
    mat.current.opacity = THREE.MathUtils.damp(mat.current.opacity, intro * (1 - Math.min(1, scene.t * 1.4)), 3, delta);
    ref.current.visible = mat.current.opacity > 0.01;
  });
  if (!tex) return null;
  return (
    <mesh ref={ref} position={[0, 0, z]} renderOrder={-5}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial ref={mat} map={tex} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* 떠다니는 유리·크롬 조각 (깊이감)                                     */
/* ------------------------------------------------------------------ */
function Fragments({ count = 16 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i % 2 ? 1 : -1) * (0.25 + Math.random() * 0.75),
        y: Math.random(),
        z: -2.5 + Math.random() * 4.5,
        w: 0.14 + Math.random() * 0.3,
        h: 0.22 + Math.random() * 0.45,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        sp: 0.1 + Math.random() * 0.35,
        drift: 0.6 + Math.random() * 0.8,
      })),
    [count]
  );
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const time = state.clock.elapsedTime * (scene.reducedMotion ? 0.2 : 1);
    const e = explodeAmount(now());
    g.children.forEach((m, i) => {
      const it = items[i];
      const depth = 1 + (it.z + 2.5) * 0.25;
      const span = viewport.height * 1.6;
      // 스크롤에 따라 위로 흐르고 화면 밖으로 나가면 아래에서 다시 등장
      let y = (it.y * span + scene.progress * span * 2.2 * it.drift + time * 0.04 * it.drift) % span;
      y = y - span / 2;
      m.position.set(
        it.x * viewport.width * 0.55 + pointer.x * 0.25 * depth + Math.sign(it.x) * e * 0.8,
        y + pointer.y * 0.15 * depth,
        it.z
      );
      m.rotation.x = it.rx + time * it.sp;
      m.rotation.y = it.ry + time * it.sp * 0.7 + e * 2;
      const s = scene.started ? 1 : 0.001;
      m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, s, 2, delta));
    });
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} scale={0.001}>
          <boxGeometry args={[it.w, it.h, 0.025]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.85}
            roughness={0.12}
            clearcoat={1}
            iridescence={1}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[200, 900]}
            envMapIntensity={1.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 분해 조각                                                           */
/* ------------------------------------------------------------------ */
function useShardGeometry() {
  return useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 4).toNonIndexed();
    const pos = g.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    const center = new Float32Array(count * 3);
    const dir = new Float32Array(count * 3);
    const rand = new Float32Array(count * 4);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const m = new THREE.Vector3();
    for (let i = 0; i < count; i += 3) {
      a.fromBufferAttribute(pos, i);
      b.fromBufferAttribute(pos, i + 1);
      c.fromBufferAttribute(pos, i + 2);
      m.copy(a).add(b).add(c).divideScalar(3);
      const d = m.clone().normalize();
      d.x += (Math.random() - 0.5) * 0.6;
      d.y += (Math.random() - 0.5) * 0.6 + 0.15;
      d.z += (Math.random() - 0.5) * 0.6;
      d.normalize();
      const ax = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      const w = Math.random();
      for (let k = 0; k < 3; k++) {
        center.set([m.x, m.y, m.z], (i + k) * 3);
        dir.set([d.x, d.y, d.z], (i + k) * 3);
        rand.set([ax.x, ax.y, ax.z, w], (i + k) * 4);
      }
    }
    g.setAttribute("aCenter", new THREE.BufferAttribute(center, 3));
    g.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    g.computeVertexNormals();
    return g;
  }, []);
}

const shardVertex = /* glsl */ `
  uniform float uExplode;
  uniform float uHold;
  uniform float uTime;
  attribute vec3 aCenter;
  attribute vec3 aDir;
  attribute vec4 aRand;
  varying vec3 vN;
  varying vec3 vV;
  vec3 rot(vec3 v, vec3 ax, float a) {
    return v * cos(a) + cross(ax, v) * sin(a) + ax * dot(ax, v) * (1.0 - cos(a));
  }
  void main() {
    float e = uExplode;
    vec3 jitter = aDir * uHold * 0.035 * sin(uTime * 40.0 + aRand.w * 20.0);
    vec3 local = position - aCenter;
    float ang = e * (2.0 + aRand.w * 5.0);
    local = rot(local, aRand.xyz, ang) * (1.0 - e * 0.25);
    vec3 c = aCenter + aDir * e * (1.4 + aRand.w * 2.6) + jitter;
    vec4 mv = modelViewMatrix * vec4(c + local, 1.0);
    vN = normalize(normalMatrix * rot(normal, aRand.xyz, ang));
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const shardFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
    float f = pow(1.0 - abs(dot(n, vV)), 2.0);
    float spec = pow(max(dot(reflect(-vV, n), normalize(vec3(0.4, 0.8, 0.6))), 0.0), 24.0);
    vec3 col = mix(uColor * 0.9, vec3(0.92, 0.95, 1.0), f) + spec * 1.2;
    gl_FragColor = vec4(col, 0.75 + f * 0.25);
  }
`;

function Shards() {
  const geo = useShardGeometry();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const e = explodeAmount(now());
    // R3F가 uniforms 객체를 복사하므로 머티리얼에 실제로 붙은 uniforms를 갱신한다
    const u = mat.current?.uniforms;
    if (u) {
      u.uExplode.value = e;
      u.uHold.value = scene.hold;
      u.uTime.value = state.clock.elapsedTime;
      (u.uColor.value as THREE.Color).copy(accent);
    }
    if (mesh.current) mesh.current.visible = e > 0.001 || scene.hold > 0.02;
  });
  return (
    <mesh ref={mesh} geometry={geo} visible={false} renderOrder={2}>
      <shaderMaterial
        ref={mat}
        uniforms={{
          uExplode: { value: 0 },
          uHold: { value: 0 },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(LOGO.color) },
        }}
        vertexShader={shardVertex}
        fragmentShader={shardFragment}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* 행성                                                                */
/* ------------------------------------------------------------------ */
type Tinted = THREE.Material & { color?: THREE.Color; emissive?: THREE.Color; attenuationColor?: THREE.Color };

function Planet({ quality }: { quality: "high" | "low" }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Mesh>(null);
  const node = useRef<THREE.Group>(null);
  const sats = useRef<(THREE.Mesh | null)[]>([]);
  const glass = useRef<Tinted>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const rim = useRef<THREE.ShaderMaterial>(null);
  const solids = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const intro = useRef(0);
  const { viewport, pointer } = useThree();
  const satSeeds = useMemo(() => orbit.items.map(() => Math.random() * Math.PI * 2), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * (scene.reducedMotion ? 0.2 : 1);
    const wide = viewport.aspect > 1.05;
    const pose = poseAt(wide ? POSES_WIDE : POSES_NARROW, scene.t);
    const unit = wide ? Math.min(viewport.height * 0.2, viewport.width * 0.11) : viewport.width * 0.19;
    intro.current = THREE.MathUtils.damp(intro.current, scene.started ? 1 : 0, 2.2, delta);
    const e = explodeAmount(now());

    // 강조색 전환
    accentTarget.set(scene.accent);
    accent.lerp(accentTarget, 1 - Math.exp(-delta * 4));
    if (glass.current) {
      // 굴절 재질은 밝게(흡수색으로 착색), 저사양 재질은 강조색 그대로
      glass.current.color?.copy(quality === "high" ? tmp.copy(accent).lerp(WHITE, 0.72) : accent);
      glass.current.attenuationColor?.copy(accent);
    }
    glow.current?.color.copy(accent);
    if (rim.current) (rim.current.uniforms.uColor.value as THREE.Color).copy(accent);
    solids.current.forEach((m) => {
      if (!m) return;
      m.color.copy(accent);
      m.emissive.copy(accent);
    });

    if (root.current) {
      const g = root.current;
      g.position.x = THREE.MathUtils.damp(g.position.x, pose.x * viewport.width, 4, delta);
      g.position.y = THREE.MathUtils.damp(g.position.y, pose.y * viewport.height + Math.sin(time * 0.7) * 0.05, 4, delta);
      const s = unit * pose.s * (0.15 + 0.85 * intro.current);
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, delta));
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.3 + pose.spin * 0.6, 2.5, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.18, 2.5, delta);
    }
    if (body.current) body.current.visible = !(e > 0.002 || scene.hold > 0.02);
    if (ring.current) ring.current.scale.setScalar(1 + e * 0.35);
    if (moon.current) {
      const a = 0.6 + time * 0.4;
      moon.current.position.set(Math.cos(a) * LOGO.ringRadius, Math.sin(a) * LOGO.ringRadius, 0);
    }
    if (node.current) {
      const a = -Math.PI / 2 - time * 0.28;
      node.current.position.set(Math.cos(a) * 0.4, Math.sin(a) * 1.2, Math.cos(a) * 1.05);
    }
    const n = sats.current.length;
    sats.current.forEach((m, i) => {
      if (!m) return;
      const free = satSeeds[i] + time * (0.15 + i * 0.05);
      const aligned = (i / n) * Math.PI * 2 + time * 0.12;
      const a = free + (aligned - free) * pose.align;
      m.position.set(Math.cos(a) * LOGO.ringRadius, Math.sin(a) * LOGO.ringRadius, 0);
      m.scale.setScalar(Math.max(0.001, pose.align));
    });
  });

  const solid = (i: number, intensity: number) => (
    <meshStandardMaterial
      ref={(m) => void (solids.current[i] = m)}
      color={LOGO.color}
      emissive={LOGO.color}
      emissiveIntensity={intensity}
      roughness={0.3}
      metalness={0.2}
    />
  );

  return (
    <group ref={root} scale={0.001}>
      <group ref={body}>
        <mesh>
          <sphereGeometry args={[LOGO.planetRadius, 96, 96]} />
          {quality === "high" ? (
            <MeshTransmissionMaterial
              ref={glass as React.Ref<never>}
              color="#d9e7fa"
              attenuationColor={LOGO.color}
              attenuationDistance={2.2}
              envMapIntensity={1.6}
              thickness={1.4}
              roughness={0.06}
              ior={1.32}
              chromaticAberration={0.08}
              anisotropicBlur={0.08}
              distortion={0.3}
              distortionScale={0.4}
              temporalDistortion={0.08}
              backside
              backsideThickness={0.4}
              samples={6}
              resolution={768}
            />
          ) : (
            <meshPhysicalMaterial
              ref={glass as React.Ref<never>}
              color={LOGO.color}
              roughness={0.18}
              metalness={0.05}
              clearcoat={1}
              clearcoatRoughness={0.05}
              transparent
              opacity={0.94}
              envMapIntensity={0.6}
            />
          )}
        </mesh>
        <mesh scale={0.55}>
          <sphereGeometry args={[LOGO.planetRadius, 32, 32]} />
          <meshBasicMaterial ref={glow} color={LOGO.color} transparent opacity={0.35} toneMapped={false} />
        </mesh>
        <mesh scale={1.004}>
          <sphereGeometry args={[LOGO.planetRadius, 64, 64]} />
          <shaderMaterial
            ref={rim}
            transparent
            depthWrite={false}
            uniforms={{ uColor: { value: new THREE.Color(LOGO.color) } }}
            vertexShader={/* glsl */ `
              varying vec3 vN; varying vec3 vV;
              void main() {
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                vN = normalize(normalMatrix * normal);
                vV = normalize(-mv.xyz);
                gl_Position = projectionMatrix * mv;
              }`}
            fragmentShader={/* glsl */ `
              uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
              void main() {
                float f = 1.0 - abs(dot(vN, vV));
                gl_FragColor = vec4(uColor, smoothstep(0.78, 0.98, f) * 0.9);
              }`}
          />
        </mesh>
      </group>

      <Shards />

      <group rotation={[0, 0, LOGO.ringRoll]}>
        <group ref={ring} rotation={[LOGO.ringTilt, 0, 0]}>
          <mesh>
            <torusGeometry args={[LOGO.ringRadius, LOGO.stroke * 1.15, 24, 256]} />
            {solid(0, 0.55)}
          </mesh>
          <mesh ref={moon}>
            <sphereGeometry args={[LOGO.moonRadius, 32, 32]} />
            {solid(1, 0.7)}
          </mesh>
          {orbit.items.map((it, i) => (
            <mesh key={it.key} ref={(m) => void (sats.current[i] = m)} scale={0.001}>
              <sphereGeometry args={[LOGO.moonRadius * 0.85, 24, 24]} />
              <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.15} envMapIntensity={2} />
            </mesh>
          ))}
        </group>
      </group>

      <group ref={node}>
        <Billboard>
          <mesh>
            <torusGeometry args={[LOGO.nodeRadius, LOGO.stroke, 16, 64]} />
            {solid(2, 0.6)}
          </mesh>
        </Billboard>
      </group>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Environment resolution={256}>
        <color attach="background" args={["#dfe8fb"]} />
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[3, 3, 4]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[-3, 2, 3]} scale={[1, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#c9b8ff" position={[-4, -1, 2]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={2.5} color="#9cc4ff" position={[0, 0, -5]} scale={4} />
        <Lightformer form="rect" intensity={1.5} color="#4289D8" position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
      </Environment>
    </>
  );
}

export default function World() {
  const [quality, setQuality] = useState<"high" | "low">("high");
  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)").matches;
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
    if (small || lowCpu) setQuality("low");
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={quality === "high" ? [1, 2] : [1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 35 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        onCreated={() => {
          requestAnimationFrame(() => {
            scene.ready = true;
            emit();
          });
        }}
      >
        <Lights />
        <Backdrop />
        <Wordmark />
        <Fragments count={quality === "high" ? 16 : 9} />
        <Planet quality={quality} />
      </Canvas>
    </div>
  );
}
