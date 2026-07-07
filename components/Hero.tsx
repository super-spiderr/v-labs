/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MouseIcon } from "@hugeicons/core-free-icons";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import SplitText from "@/components/SplitText";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [mascotSrc, setMascotSrc] = useState("/mascot_flying.png?v=4");
  const [isEntering, setIsEntering] = useState(true);
  const isEnteringRef = useRef(true);

  // Floating shapes refs
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);
  const shape4Ref = useRef<HTMLDivElement>(null);
  const shape5Ref = useRef<HTMLDivElement>(null);
  const shape6Ref = useRef<HTMLDivElement>(null);

  // Mascot layered animation refs
  const mascotRef = useRef<HTMLDivElement>(null);
  const mascotParallaxRef = useRef<HTMLDivElement>(null);
  const mascotInnerRef = useRef<HTMLDivElement>(null);
  const mascotImgRef = useRef<HTMLImageElement>(null);

  // 1. Particle Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates relative to window center
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen (-1 to 1)
      mouse.targetX =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.targetY =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Define particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
      baseX: number;
      baseY: number;
      parallaxFactor: number;
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(120, Math.floor((width * height) / 12000));

    const colors = [
      "rgba(20, 184, 166,", // Teal
      "rgba(168, 85, 247,", // Purple
      "rgba(236, 72, 153,", // Pink
      "rgba(255, 255, 255,", // White
    ];

    for (let i = 0; i < particleCount; i++) {
      const pX = Math.random() * width;
      const pY = Math.random() * height;
      particles.push({
        x: pX,
        y: pY,
        baseX: pX,
        baseY: pY,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        parallaxFactor: Math.random() * 15 + 5, // Parallax depth factor
      });
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      particles.forEach((p) => {
        // Drift movement
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Boundary wrap
        if (p.baseX < 0) p.baseX = width;
        if (p.baseX > width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = height;
        if (p.baseY > height) p.baseY = 0;

        // Apply mouse interactive parallax
        // Closer particles (higher parallaxFactor) shift more
        p.x = p.baseX - mouse.x * p.parallaxFactor;
        p.y = p.baseY - mouse.y * p.parallaxFactor;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = p.radius > 1.2 ? 4 : 0;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
      });

      // Subtle constellation lines between close particles
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.07;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      globalThis.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 2. GSAP Floating & Parallax Effect
  useGSAP(
    () => {
      const isMobile = window.innerWidth < 768;
      const initialLandingY = isMobile ? -130 : -190;

      const textElements = textContainerRef.current
        ? textContainerRef.current.querySelectorAll("h3, p, .decorative-badge")
        : null;

      // 0. Fall Entrance Animation
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          setMascotSrc("/mascot_flying.png?v=4");
          isEnteringRef.current = false;
          setIsEntering(false);

          // Start float loop on the inner wrapper
          gsap.to(mascotInnerRef.current, {
            y: "-=15",
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Kill entrance timeline to release property controls
          tl.kill();
        },
      });

      gsap.set(mascotRef.current, {
        y: -1000,
        scale: 1.4,
        opacity: 0,
      });

      gsap.set(mascotImgRef.current, {
        rotation: -25,
      });

      if (textElements && textElements.length > 0) {
        gsap.set(textElements, {
          opacity: 0,
          y: 40,
        });
      }

      tl.to(mascotRef.current, {
        y: initialLandingY, // Lands above the name Vignesh
        scale: 1,
        opacity: 1,
        duration: 1.6,
        ease: "back.out(1.2)",
      });

      // Animate mascot rotation in sync with the fall
      tl.to(
        mascotImgRef.current,
        {
          rotation: 0,
          duration: 1.6,
          ease: "back.out(1.2)",
        },
        "<", // Parallel start
      );

      // Stagger reveal the name (h3) and subtitle/badge inside the container as the mascot lands
      if (textElements && textElements.length > 0) {
        tl.to(
          textElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=1.1", // Starts when the mascot is about halfway down
        );
      }

      // Standard floating loop animations for the shapes
      gsap.to(shape1Ref.current, {
        y: "-=25",
        rotation: 360,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(shape2Ref.current, {
        y: "+=20",
        rotation: -360,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(shape3Ref.current, {
        y: "-=15",
        rotation: 180,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(shape4Ref.current, {
        y: "-=18",
        rotation: 90,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(shape5Ref.current, {
        y: "+=22",
        rotation: -180,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(shape6Ref.current, {
        y: "-=25",
        rotation: 360,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Mouse move parallax listener
      const handleMouseMoveParallax = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPercent =
          (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const yPercent =
          (clientY - window.innerHeight / 2) / (window.innerHeight / 2);

        // Parallax shapes
        gsap.to(shape1Ref.current, {
          x: xPercent * 60,
          y: yPercent * 60,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(shape2Ref.current, {
          x: xPercent * -40,
          y: yPercent * -40,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(shape3Ref.current, {
          x: xPercent * 30,
          y: yPercent * -50,
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(shape4Ref.current, {
          x: xPercent * -55,
          y: yPercent * 25,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(shape5Ref.current, {
          x: xPercent * 45,
          y: yPercent * -35,
          duration: 1.1,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(shape6Ref.current, {
          x: xPercent * -35,
          y: yPercent * -55,
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (!isEnteringRef.current) {
          gsap.to(mascotParallaxRef.current, {
            x: xPercent * 30,
            y: yPercent * 30,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        // Text container subtle follow
        gsap.to(textContainerRef.current, {
          x: xPercent * 15,
          y: yPercent * 15,
          duration: 0.6,
          ease: "power1.out",
          overwrite: "auto",
        });
      };

      globalThis.addEventListener("mousemove", handleMouseMoveParallax);

      return () => {
        globalThis.removeEventListener("mousemove", handleMouseMoveParallax);
      };
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#030303] flex items-center justify-center pt-20 md:pt-28 select-none"
    >
      {/* Background Neon Gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[400px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Floating Mascot Character (Absolute inside Hero container) */}
      <div
        ref={mascotRef}
        className="absolute top-[53%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-44 h-44 md:w-60 md:h-60 pointer-events-none"
      >
        <div ref={mascotParallaxRef} className="w-full h-full">
          <div ref={mascotInnerRef} className="relative w-full h-full">
            {/* Subtle neon glowing circle behind mascot */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-teal-500/20 to-purple-500/20 blur-xl opacity-60 pointer-events-none" />
            <img
              ref={mascotImgRef}
              src={mascotSrc}
              alt="Mascot character"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </div>

      {/* Interactive Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Airflow streaks while falling */}
      {isEntering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <div className="absolute w-[2px] h-36 bg-gradient-to-b from-transparent via-white/20 to-transparent top-[-10%] left-[45%] animate-airflow-1" />
          <div className="absolute w-[2px] h-24 bg-gradient-to-b from-transparent via-teal-400/25 to-transparent top-[-10%] left-[53%] animate-airflow-2" />
          <div className="absolute w-[1.5px] h-48 bg-gradient-to-b from-transparent via-purple-400/20 to-transparent top-[-10%] left-[38%] animate-airflow-3" />
          <div className="absolute w-[2px] h-30 bg-gradient-to-b from-transparent via-white/25 to-transparent top-[-10%] left-[62%] animate-airflow-4" />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes airflow {
              0% { transform: translateY(110vh); opacity: 0; }
              25% { opacity: 0.6; }
              75% { opacity: 0.6; }
              100% { transform: translateY(-110vh); opacity: 0; }
            }
            .animate-airflow-1 { animation: airflow 0.5s linear infinite; }
            .animate-airflow-2 { animation: airflow 0.4s linear infinite 0.1s; }
            .animate-airflow-3 { animation: airflow 0.7s linear infinite 0.2s; }
            .animate-airflow-4 { animation: airflow 0.6s linear infinite 0.15s; }
          `,
            }}
          />
        </div>
      )}

      {/* Floating 3D-like Shapes */}
      {/* Shape 1: Pink glowing Curly Braces (top-right area) */}
      <div
        ref={shape1Ref}
        className="absolute top-[22%] right-[8%] md:right-[12%] z-10 w-24 h-24 md:w-32 md:h-32 opacity-70 pointer-events-none filter drop-shadow-[0_0_20px_rgba(236,72,153,0.35)]"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="font-mono"
        >
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontSize="70"
            fontWeight="bold"
            fill="none"
            stroke="url(#pinkGradient)"
            strokeWidth="2.5"
          >{`{}`}</text>
          <defs>
            <linearGradient id="pinkGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Shape 2: Cyan glowing Code Tag (top-left/center area) */}
      <div
        ref={shape3Ref}
        className="absolute top-[30%] left-[8%] md:left-[10%] z-10 w-20 h-20 md:w-28 md:h-28 opacity-60 pointer-events-none filter drop-shadow-[0_0_20px_rgba(20,184,166,0.3)]"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="font-mono"
        >
          <text
            x="50"
            y="66"
            textAnchor="middle"
            fontSize="55"
            fontWeight="bold"
            fill="none"
            stroke="url(#cyanGradient)"
            strokeWidth="2"
          >{`</>`}</text>
          <defs>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Shape 3: Purple glowing Square Brackets (bottom center-left area) */}
      <div
        ref={shape2Ref}
        className="absolute bottom-[22%] left-[10%] md:left-[14%] z-10 w-24 h-24 md:w-32 md:h-32 opacity-50 pointer-events-none filter drop-shadow-[0_0_25px_rgba(168,85,247,0.3)]"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="font-mono"
        >
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontSize="65"
            fontWeight="bold"
            fill="none"
            stroke="url(#purpleGradient)"
            strokeWidth="2.5"
          >{`[]`}</text>
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Shape 4: Amber glowing Prompt/Dollar sign (bottom-right area) */}
      <div
        ref={shape4Ref}
        className="absolute bottom-[32%] right-[6%] md:right-[10%] z-10 w-20 h-20 md:w-26 md:h-26 opacity-60 pointer-events-none filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="font-mono"
        >
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontSize="65"
            fontWeight="bold"
            fill="none"
            stroke="url(#amberGradient)"
            strokeWidth="2.5"
          >{`$`}</text>
          <defs>
            <linearGradient id="amberGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Shape 5: Emerald/Green glowing Parentheses (middle-right area) */}
      <div
        ref={shape5Ref}
        className="absolute top-[52%] right-[8%] md:right-[12%] z-10 w-22 h-22 md:w-28 md:h-28 opacity-45 pointer-events-none filter drop-shadow-[0_0_20px_rgba(16,185,129,0.25)]"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="font-mono"
        >
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontSize="60"
            fontWeight="bold"
            fill="none"
            stroke="url(#emeraldGradient)"
            strokeWidth="2.5"
          >{`()`}</text>
          <defs>
            <linearGradient
              id="emeraldGradient"
              x1="0"
              y1="0"
              x2="100"
              y2="100"
            >
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Shape 6: Blue glowing Semicolon (bottom-left area) */}
      <div
        ref={shape6Ref}
        className="absolute bottom-[16%] left-[6%] md:left-[8%] z-10 w-24 h-24 md:w-30 md:h-30 opacity-55 pointer-events-none filter drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="font-mono"
        >
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontSize="65"
            fontWeight="bold"
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="2.5"
          >{`;`}</text>
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Center Typography & Hero Text */}
      <div
        ref={textContainerRef}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl"
      >
        <h3 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white select-text leading-tight pb-3">
          <SplitText
            text="I'm Vignesh"
            delay={80}
            duration={1.5}
            ease="power4.out"
            threshold={0.1}
            onLetterAnimationComplete={() => {}}
          />
        </h3>

        {/* Animated Subtitle */}
        <p className="mt-6 text-sm md:text-lg tracking-[0.25em] md:tracking-[0.4em] text-muted-foreground uppercase select-text font-medium bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
          Full Stack / React Native / Node.js
        </p>

        {/* One-line Self Intro Paragraph */}
        <p className="mt-6 text-sm md:text-base text-muted-foreground/80 font-sans max-w-2xl mx-auto select-text font-normal leading-relaxed">
          Full-stack engineer with a mobile-first background and 6+ years of experience.
          Shipping end-to-end features across EV telemetry, sports tech, retail, and SaaS architectures.
        </p>

        {/* Dynamic decorative badge */}
        <div className="decorative-badge mt-8 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] md:text-xs tracking-wider text-teal-400 font-mono uppercase">
          ✦ Shipped Across EV & Sports Tech ✦
        </div>
      </div>

      {/* Bottom Scroll Down Mouse Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/60 transition-opacity hover:opacity-100 duration-300">
        <HugeiconsIcon icon={MouseIcon} className="size-6 animate-bounce" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono">
          Scroll
        </span>
      </div>
    </section>
  );
}
