"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import About from "@/components/About";
import Contact from "@/components/Contact";

import projectsData from "@/lib/data/projects.json";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  mascotImage: string;
  screenshotImage: string;
  link: string;
  landingColor: string;
  landingGlow: string;
  catalogColor: string;
  catalogGlow: string;
}

const projects = projectsData.slice(0, 3) as Project[];

interface ProjectCardProps {
  proj: Project;
  idx: number;
  activeProject: number;
  setActiveProject: (idx: number) => void;
  winWidth: number;
  isMobile: boolean;
  tilt: { x: number; y: number };
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
}

interface ProjectCardInnerProps {
  proj: Project;
  idx: number;
  isCenter: boolean;
  isMobile: boolean;
  tilt: { x: number; y: number };
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  activeProject: number;
}

function ProjectCardInner({
  proj,
  idx,
  isCenter,
  isMobile,
  tilt,
  handleMouseMove,
  handleMouseLeave,
  activeProject,
}: ProjectCardInnerProps) {
  const isMouseMoveHandler = isCenter && !isMobile ? handleMouseMove : undefined;
  const isMouseLeaveHandler = isCenter && !isMobile ? handleMouseLeave : undefined;

  const transformStyle =
    isCenter && !isMobile
      ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      : "rotateX(0deg) rotateY(0deg)";

  const transitionStyle = isCenter
    ? "transform 0.05s ease-out"
    : "transform 0.6s ease-in-out";

  const containerClassName = `w-full h-full bg-gradient-to-br from-[#0c0c16]/85 to-[#05050b]/90 backdrop-blur-xl border rounded-3xl p-6 lg:p-8 flex flex-col-reverse md:flex-row items-center justify-between relative overflow-hidden group/card shadow-2xl ${
    isCenter
      ? "cursor-default border-teal-500/25 shadow-[0_0_50px_rgba(20,184,166,0.04)]"
      : "cursor-pointer border-white/5"
  }`;

  const circularViewportClassName = `relative w-[140px] h-[140px] lg:w-[210px] lg:h-[210px] rounded-full border ${
    isCenter
      ? "border-teal-500/25 shadow-[0_0_30px_rgba(20,184,166,0.12)]"
      : "border-white/5"
  } bg-teal-950/15 flex items-center justify-center transition-colors duration-500`;

  return (
    <div
      onMouseMove={isMouseMoveHandler}
      onMouseLeave={isMouseLeaveHandler}
      style={{
        transform: transformStyle,
        transition: transitionStyle,
        transformStyle: "preserve-3d",
      }}
      className={containerClassName}
    >
      {/* Diagnostic Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)] pointer-events-none" />

      {/* Card Content (Specs) */}
      <div className="w-full md:w-[60%] flex flex-col justify-between h-full z-10 mt-4 md:mt-0">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-teal-400 font-mono text-[9px] md:text-[10px] font-semibold tracking-wider uppercase">
              {proj.subtitle}
            </span>
            <span className="text-muted-foreground/30 font-mono text-xs">
              /0{idx + 1}
            </span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1">
            {proj.title}
          </h3>
          <p className="text-muted-foreground text-[12px] lg:text-[13px] font-sans leading-relaxed mt-2 max-w-md">
            {proj.description}
          </p>
        </div>

        <div className="mt-4">
          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5">
            {proj.tech.map((t, techIdx) => (
              <span
                key={techIdx + 1}
                className="px-2 py-0.5 rounded-full border border-teal-500/10 bg-teal-500/5 text-teal-400 font-mono text-[9px] uppercase"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Action Link Button */}
          <div className="mt-4.5 flex">
            {isCenter ? (
              <a
                href={proj.link}
                className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 text-teal-400 text-[10px] lg:text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 pointer-events-auto"
              >
                <span>Launch Mission</span>
                <svg
                  className="size-3.5 text-teal-400 group-hover/btn:translate-x-1 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            ) : (
              <span className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[10px] lg:text-xs font-mono uppercase tracking-wider transition-all duration-300 pointer-events-none">
                <span>Launch Mission</span>
                <svg
                  className="size-3.5 text-teal-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Circular Viewport (Mascot Chamber with 3D Pop-out) */}
      <div className="w-full md:w-[35%] flex items-center justify-center z-10">
        <div className={circularViewportClassName}>
          {/* Mascot container that floats (overflow-visible to break out) */}
          <div className="animate-mascot-float flex items-center justify-center w-full h-full relative overflow-visible">
            {/* Portal glow aura */}
            <div
              className={`absolute w-20 h-20 rounded-full blur-2xl opacity-40 bg-gradient-to-r ${proj.landingColor}`}
              style={{
                boxShadow: `0 0 40px ${proj.landingGlow}`,
              }}
            />
            {/* Mascot Image (Pops out / Breaks out of top boundary) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeProject} // Force recreate to trigger materialize animation
              src={proj.mascotImage}
              alt={`${proj.title} mascot`}
              className="absolute bottom-[-10px] lg:bottom-[-15px] w-[155px] h-[155px] lg:w-[225px] lg:h-[225px] max-w-none object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] animate-holo-in select-none pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  proj,
  idx,
  activeProject,
  setActiveProject,
  winWidth,
  isMobile,
  tilt,
  handleMouseMove,
  handleMouseLeave,
}: ProjectCardProps) {
  const diff = (idx - activeProject + 3) % 3;
  const isCenter = diff === 0;

  // Calculate 3D perspective translations
  const tx = winWidth < 1280 ? 250 : 340;

  let transformStyle = "translate3d(0px, 0px, 0px) rotateY(0deg)";
  if (!isCenter) {
    const direction = diff === 1 ? 1 : -1;
    transformStyle = `translate3d(${direction * tx}px, 0px, -200px) rotateY(${-direction * 20}deg)`;
  }

  const opacityClass = isCenter
    ? "opacity-100 scale-100 shadow-[0_25px_60px_rgba(0,0,0,0.75)]"
    : "opacity-35 scale-[0.78] blur-[1px] hover:opacity-50 hover:scale-[0.8]";

  const zIndexClass = isCenter ? "z-30" : "z-10";

  let cardStyle = {};
  if (!isMobile) {
    cardStyle = {
      transform: transformStyle,
      transition:
        "transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.7s ease, filter 0.7s ease",
    };
  }

  let wrapperClass = `absolute w-full max-w-[680px] lg:max-w-[760px] h-[350px] lg:h-[390px] pointer-events-auto transition-all duration-700 ${zIndexClass} ${opacityClass}`;
  if (isMobile) {
    wrapperClass = isCenter
      ? "relative w-full max-w-md opacity-100 scale-100 z-30 pointer-events-auto"
      : "hidden";
  }

  const sharedClassName = `${wrapperClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40 rounded-3xl text-left bg-transparent border-none p-0 outline-none`;

  if (isCenter) {
    return (
      <div style={cardStyle} className={sharedClassName}>
        <ProjectCardInner
          proj={proj}
          idx={idx}
          isCenter={isCenter}
          isMobile={isMobile}
          tilt={tilt}
          handleMouseMove={handleMouseMove}
          handleMouseLeave={handleMouseLeave}
          activeProject={activeProject}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Show ${proj.title} project details`}
      onClick={() => setActiveProject(idx)}
      style={cardStyle}
      className={sharedClassName}
    >
      <ProjectCardInner
        proj={proj}
        idx={idx}
        isCenter={isCenter}
        isMobile={isMobile}
        tilt={tilt}
        handleMouseMove={handleMouseMove}
        handleMouseLeave={handleMouseLeave}
        activeProject={activeProject}
      />
    </button>
  );
}

export default function Home() {
  const [activeProject, setActiveProject] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const projectCanvasRef = useRef<HTMLCanvasElement>(null);

  const [winWidth, setWinWidth] = useState<number>(1200);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-sliding interval loop (resets timer on manual click/select updates)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % 3);
    }, 5500); // 5.5s autoplay interval
    return () => clearInterval(timer);
  }, [activeProject, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setTilt({
      x: ((yc - y) / yc) * 6,
      y: ((x - xc) / xc) * 6,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Space Starfield & Code Constellation Simulation
  useEffect(() => {
    const canvas = projectCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (canvas?.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // 3D Starfield points
    const starCount = 120;
    const stars: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1500,
        z: Math.random() * width,
      });
    }

    // Space code debris constellation particles
    const debrisWords = [
      "{}",
      "[]",
      "</>",
      "()",
      ";",
      "const",
      "return",
      "let",
      "🚀",
    ];
    const debrisCount = 14;
    const debris: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      word: string;
      size: number;
      rot: number;
      rotSpeed: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < debrisCount; i++) {
      debris.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        word: debrisWords[i % debrisWords.length],
        size: Math.random() * 8 + 12,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    const draw = () => {
      // Solid color clear to avoid flashing and ghost trails
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw 3D starfield at a constant, peaceful pace
      stars.forEach((star) => {
        const prevZ = star.z;
        star.z -= 0.8;

        // Reset stars that are past the viewport screen
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * 1500;
          star.y = (Math.random() - 0.5) * 1500;
        }

        // Draw star path
        const scale = 220;
        const px = (star.x / star.z) * scale + centerX;
        const py = (star.y / star.z) * scale + centerY;
        const prevPx = (star.x / prevZ) * scale + centerX;
        const prevPy = (star.y / prevZ) * scale + centerY;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);

          const opacity = Math.min(0.8, (1 - star.z / width) * 0.6);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw floating space code debris
      debris.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        d.rot += d.rotSpeed;

        // Bounce off canvas boundaries
        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.font = `bold ${d.size}px monospace`;
        ctx.fillStyle = `rgba(168, 85, 247, ${d.opacity})`;
        ctx.shadowColor = "rgba(168, 85, 247, 0.4)";
        ctx.shadowBlur = 10;
        ctx.fillText(d.word, 0, 0);
        ctx.restore();
      });

      // Draw constellation paths connecting close debris nodes
      ctx.shadowBlur = 0;
      for (let i = 0; i < debris.length; i++) {
        for (let j = i + 1; j < debris.length; j++) {
          const dx = debris[i].x - debris[j].x;
          const dy = debris[i].y - debris[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.08;
            ctx.beginPath();
            ctx.moveTo(debris[i].x, debris[i].y);
            ctx.lineTo(debris[j].x, debris[j].y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mascot animations are handled via highly-performant CSS styles nested in the card chamber viewports.

  return (
    <main className="relative w-full min-h-screen bg-[#030303]">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Space-themed Interactive Projects Section (Fits screen viewport) */}
      <section
        ref={containerRef}
        id="projects"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full min-h-screen lg:h-screen lg:min-h-0 bg-[#050508] border-t border-border/10 px-6 md:px-12 py-16 lg:py-0 flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* CSS Styles for Carousel Floating and Holo Animations */}
        <style>{`
          @keyframes mascot-float-custom {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
          }
          .animate-mascot-float {
            animation: mascot-float-custom 4.5s ease-in-out infinite;
          }
          @keyframes holo-materialize {
            0% {
              opacity: 0.15;
              transform: scale(0.86);
              filter: hue-rotate(180deg) brightness(2.2) contrast(1.4) blur(10px);
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: hue-rotate(0deg) brightness(1) contrast(1) blur(0px);
            }
          }
          .animate-holo-in {
            animation: holo-materialize 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }
        `}</style>

        {/* Deep space 3D Canvas */}
        <canvas
          ref={projectCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Space neon glow backgrounds */}
        <div className="absolute top-[20%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-screen-2xl w-full mx-auto flex flex-col items-center justify-center z-10 relative">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8 border-b border-white/10 pb-3">
            <span className="text-teal-400 font-mono text-[10px] lg:text-xs uppercase tracking-widest">
              01 / Selected Missions
            </span>
            <h2 className="text-3xl lg:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-0.5">
              Projects
            </h2>
          </div>

          {/* 3D Perspective Card Deck / Carousel Wrapper */}
          <div
            className={`w-full relative flex items-center justify-center ${
              isMobile ? "h-auto py-2" : "h-[390px] lg:h-[440px]"
            } select-none`}
            style={
              isMobile
                ? undefined
                : { perspective: "1200px", transformStyle: "preserve-3d" }
            }
          >
            {projects.map((proj, idx) => (
              <ProjectCard
                key={idx + 1}
                proj={proj}
                idx={idx}
                activeProject={activeProject}
                setActiveProject={setActiveProject}
                winWidth={winWidth}
                isMobile={isMobile}
                tilt={tilt}
                handleMouseMove={handleMouseMove}
                handleMouseLeave={handleMouseLeave}
              />
            ))}
          </div>

          {/* Navigation indicators Dashboard */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 z-10 select-none">
            {/* Arrows & Pagination dots */}
            <div className="flex items-center gap-6">
              {/* Prev Arrow */}
              <button
                onClick={() => setActiveProject((activeProject - 1 + 3) % 3)}
                className="group border border-white/10 hover:border-teal-500/40 hover:bg-teal-500/5 text-muted-foreground hover:text-white transition-all rounded-full p-2.5 cursor-pointer"
                aria-label="Previous Project"
              >
                <svg
                  className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2.5">
                {projects.map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setActiveProject(idx)}
                    className={`transition-all duration-300 cursor-pointer ${
                      activeProject === idx
                        ? "w-6 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]"
                        : "w-2 h-2 rounded-full bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => setActiveProject((activeProject + 1) % 3)}
                className="group border border-white/10 hover:border-teal-500/40 hover:bg-teal-500/5 text-muted-foreground hover:text-white transition-all rounded-full p-2.5 cursor-pointer"
                aria-label="Next Project"
              >
                <svg
                  className="size-4 group-hover:translate-x-0.5 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* See More Link (Horizontal separator on desktop) */}
            <div className="hidden sm:block w-[1px] h-4 bg-white/15" />

            <div>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 text-teal-400 text-[10px] lg:text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 cursor-pointer"
              >
                <span>See More Projects</span>
                <svg
                  className="size-3.5 text-teal-400 group-hover:translate-x-0.5 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Journey Section */}
      <Journey />

      {/* 4. About Section */}
      <About />

      {/* 4. Contact Section */}
      <Contact />
    </main>
  );
}
