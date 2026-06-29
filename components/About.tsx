"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import aboutData from "@/lib/data/about.json";

interface PlanetConfig {
  name: string;
  category: string;
  description: string;
  color: string;
  glow: string;
  rx: number;
  ry: number;
  speed: number;
  offset: number;
  icon: React.ReactNode;
}

const getPlanetIcon = (iconKey: string) => {
  switch (iconKey) {
    case "AI":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M50 15 C50 35 35 50 15 50 C35 50 50 65 50 85 C50 65 65 50 85 50 C65 50 50 35 50 15 Z"
            fill="currentColor"
          />
          <circle cx="25" cy="25" r="4" fill="currentColor" />
          <circle cx="75" cy="75" r="4" fill="currentColor" />
          <circle cx="75" cy="25" r="6" fill="currentColor" />
        </svg>
      );
    case "TypeScript":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="15" y="15" width="70" height="70" rx="8" />
          <path d="M32 35 L48 35 M40 35 L40 65" strokeWidth="8" />
          <path
            d="M56 60 C60 65 70 65 70 58 C70 50 56 54 56 46 C56 40 66 38 70 44"
            strokeWidth="8"
          />
        </svg>
      );
    case "React Native":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
        >
          <ellipse
            cx="50"
            cy="50"
            rx="15"
            ry="40"
            transform="rotate(30 50 50)"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="15"
            ry="40"
            transform="rotate(90 50 50)"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="15"
            ry="40"
            transform="rotate(150 50 50)"
          />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>
      );
    case "Node.js":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" />
          <path d="M50 10 L50 90" />
          <path d="M15 30 L50 50 L85 30" />
          <path d="M15 70 L50 50 L85 70" />
        </svg>
      );
    case "Prisma":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        >
          <path d="M50 10 L85 85 L15 85 Z" />
          <path d="M50 10 L50 85" />
          <path d="M15 85 L50 60 L85 85" />
        </svg>
      );
    case "MongoDB":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 10 C30 35 30 65 50 90 C70 65 70 35 50 10 Z" />
          <path d="M50 10 L50 90" />
          <path d="M50 35 C40 45 40 55 50 65" />
          <path d="M50 30 C60 40 60 50 50 60" />
        </svg>
      );
    case "Fastify":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M25 80 L25 20 L75 20 M25 50 L65 50" />
          <path d="M35 70 L35 30 L65 30 M35 40 L55 40" strokeWidth="4" />
        </svg>
      );
    default:
      return null;
  }
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const planetsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [orbitalScale, setOrbitalScale] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const planetsData: PlanetConfig[] = useMemo(() => {
    return aboutData.planets.map((p) => ({
      ...p,
      icon: getPlanetIcon(p.iconKey),
    })) as PlanetConfig[];
  }, []);

  // Store angles of planets
  const anglesRef = useRef<number[]>(planetsData.map((p) => p.offset));
  const hoveredIndexRef = useRef<number | null>(null);

  // Responsive scale calculations
  useEffect(() => {
    const handleResize = () => {
      if (!viewportRef.current) return;
      const width = viewportRef.current.clientWidth;
      const baseWidth = 640;
      if (width < baseWidth) {
        setOrbitalScale(width / baseWidth);
      } else {
        setOrbitalScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update loop for planet orbits
  useEffect(() => {
    let animFrameId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      planetsData.forEach((planet, index) => {
        const element = planetsRefs.current[index];
        if (element) {
          // Increment angle (revolve automatically at all times)
          anglesRef.current[index] += planet.speed * delta;
          if (anglesRef.current[index] > Math.PI * 2) {
            anglesRef.current[index] -= Math.PI * 2;
          }

          const angle = anglesRef.current[index];
          const x = Math.cos(angle) * planet.rx;
          const y = Math.sin(angle) * planet.ry;
          const depth = Math.sin(angle); // ranges from -1 to 1

          const zIndex = Math.round((depth + 1) * 10) + 10;
          const scale = 0.85 + 0.3 * ((depth + 1) / 2);
          const opacity = 0.4 + 0.6 * ((depth + 1) / 2);
          const blur = depth < 0 ? Math.abs(depth) * 1.5 : 0;

          // Set positions in CSS variables
          element.style.setProperty("--x", `${x}px`);
          element.style.setProperty("--y", `${y}px`);
          element.style.setProperty("--scale", `${scale}`);
          element.style.setProperty("--opacity", `${opacity}`);
          element.style.setProperty("--blur", `${blur}px`);
          element.style.zIndex = zIndex.toString();
        }
      });

      animFrameId = requestAnimationFrame(update);
    };

    animFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrameId);
  }, [planetsData]);

  // Scroll entrance trigger animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // Bio narrative fade-in
      const fadeElements =
        containerRef.current?.querySelectorAll(".animate-fade-in");
      if (fadeElements && fadeElements.length > 0) {
        tl.fromTo(
          fadeElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
          },
        );
      }

      // Orbital system parent pop-in trigger
      tl.fromTo(
        ".orbital-system-parent",
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.4)" },
        "-=0.6",
      );
    },
    { scope: containerRef },
  );

  const hoveredPlanet =
    hoveredIndex !== null ? planetsData[hoveredIndex] : null;

  return (
    <section
      ref={containerRef}
      id="about"
      className="min-h-screen bg-[#030303] border-t border-white/5 px-6 md:px-12 py-32 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto flex flex-col gap-16 z-10">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 animate-fade-in">
          <div>
            <span className="text-teal-400 font-mono text-xs uppercase tracking-widest">
              02 / About Me
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">
              Biography
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-sm mt-4 md:mt-0 font-sans leading-relaxed">
            A look into my journey, core philosophies, and technical toolkit.
          </p>
        </div>

        {/* Reorganized Biography Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Text bio & Stats Grid */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-muted-foreground text-base md:text-lg font-sans leading-relaxed animate-fade-in">
            {aboutData.biographyParagraphs.map((paragraph, pIdx) => {
              if (paragraph.includes("Vignesh")) {
                const parts = paragraph.split("Vignesh");
                return (
                  <p key={pIdx + 1}>
                    {parts[0]}
                    <span className="text-white font-medium">Vignesh</span>
                    {parts[1]}
                  </p>
                );
              }
              return <p key={pIdx}>{paragraph}</p>;
            })}

            {/* Injected Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-6 pt-8 border-t border-white/10">
              {aboutData.stats.map((stat, statIdx) => (
                <div key={statIdx}>
                  <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </span>
                  <p className="text-xs text-muted-foreground uppercase font-mono mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Orbital Solar System Viewport */}
          <div
            ref={viewportRef}
            className="lg:col-span-6 w-full flex justify-center select-none min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] relative overflow-hidden"
          >
            <div
              className="orbital-system-parent absolute top-0 left-1/2 w-[640px] h-[500px] flex items-center justify-center origin-top"
              style={{
                transform: `translate3d(-50%, 0, 0) scale(${orbitalScale})`,
              }}
            >
              {/* Ellipse Orbit Ring Lines (SVG) */}
              <svg
                className="absolute w-full h-full pointer-events-none"
                viewBox="0 0 640 500"
                fill="none"
              >
                <g transform="translate(320, 250)">
                  {planetsData.map((planet, idx) => (
                    <ellipse
                      key={idx}
                      cx="0"
                      cy="0"
                      rx={planet.rx}
                      ry={planet.ry}
                      className="orbit-path fill-none stroke-[1.5] stroke-white/5"
                      strokeDasharray={`${idx + 4} ${idx + 4}`}
                    />
                  ))}
                </g>
              </svg>

              {/* Floating Mascot Head Core (No circular border/background) */}
              <div
                className="sun-core-outer absolute top-1/2 left-1/2 z-20 flex items-center justify-center pointer-events-none"
                style={{ transform: "translate3d(-50%, calc(-50% - 30px), 0)" }}
              >
                {/* Subtle colorful nebula glow behind the mascot head, matching active hovering planet */}
                <div
                  className="absolute w-52 h-52 rounded-full blur-3xl opacity-15 transition-all duration-700"
                  style={{
                    backgroundColor: hoveredPlanet
                      ? hoveredPlanet.color
                      : "#14b8a6",
                    boxShadow: hoveredPlanet
                      ? `0 0 75px ${hoveredPlanet.color}`
                      : "0 0 50px rgba(20, 184, 166, 0.25)",
                  }}
                />

                {/* Cropped transparent mascot head */}
                <div className="relative w-44 h-44 md:w-52 md:h-52 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/mascot_laughing.png"
                    alt="Mascot head laughing"
                    className="w-full h-full object-contain scale-[1.15] select-none transition-all duration-500"
                    style={{
                      filter: hoveredPlanet
                        ? `drop-shadow(0 0 20px ${hoveredPlanet.color})`
                        : "drop-shadow(0 0 10px rgba(255,255,255,0.18))",
                    }}
                  />
                </div>
              </div>

              {/* Orbiting Planets (Skills Badges) */}
              {planetsData.map((planet, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    planetsRefs.current[index] = el;
                  }}
                  id={`planet-${index}`}
                  className="planet-badge-wrapper absolute top-1/2 left-1/2 cursor-pointer group"
                  style={
                    {
                      position: "absolute",
                      willChange: "transform, opacity, filter",
                      transform:
                        hoveredIndex === index
                          ? "translate3d(calc(var(--x, 0px) - 50%), calc(var(--y, 0px) - 50%), 0) scale(1.2)"
                          : "translate3d(calc(var(--x, 0px) - 50%), calc(var(--y, 0px) - 50%), 0) scale(var(--scale, 1))",
                      opacity: hoveredIndex === index ? 1 : "var(--opacity, 1)",
                      filter:
                        hoveredIndex === index ? "none" : "var(--blur, 0px)",
                      zIndex: hoveredIndex === index ? 50 : undefined,
                      transition:
                        "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, filter 0.2s ease",
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    hoveredIndexRef.current = index;
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    hoveredIndexRef.current = null;
                  }}
                >
                  {/* Planet Pill Badge */}
                  <div
                    className="px-4 py-2 rounded-full border border-white/5 bg-white/2 backdrop-blur-md flex items-center gap-2.5 transition-all duration-300 group-hover:border-transparent group-hover:bg-[#07070a]/95 whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                    style={{
                      boxShadow:
                        hoveredIndex === index
                          ? `0 0 25px ${planet.glow}`
                          : "none",
                      borderColor:
                        hoveredIndex === index
                          ? planet.color
                          : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Planet Icon/Logo */}
                    <span
                      className="transition-transform duration-300 group-hover:scale-110"
                      style={{ color: planet.color }}
                    >
                      {planet.icon}
                    </span>

                    {/* Planet Label */}
                    <span className="text-white text-xs font-semibold tracking-wide">
                      {planet.name}
                    </span>
                  </div>

                  {/* Planet Details Tooltip (Fades in centered above planet) */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-52 p-3.5 rounded-2xl border border-white/5 bg-[#09090b]/95 backdrop-blur-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none z-50 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                    <div
                      className="text-[9px] uppercase font-mono font-bold tracking-widest"
                      style={{ color: planet.color }}
                    >
                      {planet.category}
                    </div>
                    <div className="text-white text-xs font-black mt-0.5 tracking-tight">
                      {planet.name}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed font-sans font-normal whitespace-normal">
                      {planet.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
