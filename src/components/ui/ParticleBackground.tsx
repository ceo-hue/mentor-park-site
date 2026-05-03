"use client";

import { useRef, useEffect, useCallback } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    baseY: number;
    phase: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  const config = {
    particle: {
      count: 150,
      colors: ["#0057FF", "#3b82f6", "#60a5fa", "#93c5fd", "#ffffff"],
      size: { min: 1, max: 4 },
      opacity: 0.7,
    },
    motion: {
      speed: 0.4,
      waveAmplitude: 25,
      waveFrequency: 0.02,
    },
    lines: {
      enabled: true,
      distance: 140,
      color: "rgba(0, 87, 255, 0.1)",
    },
    mouse: {
      radius: 250,
      strength: 0.08,
    },
  };

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = [];
    for (let i = 0; i < config.particle.count; i++) {
      const y = Math.random() * height;
      particlesRef.current.push({
        x: Math.random() * width,
        y: y,
        baseY: y,
        size: Math.random() * (config.particle.size.max - config.particle.size.min) + config.particle.size.min,
        color: config.particle.colors[Math.floor(Math.random() * config.particle.colors.length)],
        vx: (Math.random() - 0.5) * config.motion.speed,
        vy: (Math.random() - 0.5) * config.motion.speed * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }, [config.particle.count, config.particle.colors, config.particle.size.max, config.particle.size.min, config.motion.speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.y = p.baseY + Math.sin(time * 0.001 + p.phase) * config.motion.waveAmplitude;
        p.x += p.vx;
        p.baseY += p.vy;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.mouse.radius && dist > 0) {
          const force = (config.mouse.radius - dist) / config.mouse.radius * config.mouse.strength;
          p.vx += dx * force * 0.05;
          p.vy += dy * force * 0.05;
        }

        p.vx *= 0.99;
        p.vy *= 0.995;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.baseY < 0) p.baseY = canvas.height;
        if (p.baseY > canvas.height) p.baseY = 0;

        ctx.beginPath();
        ctx.globalAlpha = config.particle.opacity;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (config.lines.enabled) {
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < config.lines.distance) {
              ctx.beginPath();
              ctx.strokeStyle = config.lines.color;
              ctx.globalAlpha = (1 - dist / config.lines.distance) * 0.3;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, config.motion.waveAmplitude, config.mouse.radius, config.mouse.strength, config.particle.opacity, config.lines.enabled, config.lines.distance, config.lines.color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
