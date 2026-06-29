"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import StarfieldBackground from "@/components/StarfieldBackground";
import projectsData from "@/lib/data/projects.json";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  solution: string;
  tech: string[];
  mascotImage: string;
  screenshotImage: string;
  link: string;
  landingColor: string;
  landingGlow: string;
  catalogColor: string;
  catalogGlow: string;
}

const detailedProjects = projectsData as Project[];

export default function ProjectsCatalog() {
  const [activeProject, setActiveProject] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // GSAP Fade-in Entry Animations
  useGSAP(
    () => {
      const selectors = containerRef.current?.querySelectorAll(
        ".project-selector-item",
      );
      const header = containerRef.current?.querySelector(".header-section");
      const mainShowcase =
        containerRef.current?.querySelector(".showcase-panel");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (header) {
        tl.fromTo(
          header,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
        );
      }

      if (selectors && selectors.length > 0) {
        tl.fromTo(
          selectors,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          "-=0.4",
        );
      }

      if (mainShowcase) {
        tl.fromTo(
          mainShowcase,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8 },
          "-=0.5",
        );
      }
    },
    { scope: containerRef },
  );

  // GSAP Transition when switching active project (React Lifecycle Safe)
  useGSAP(
    () => {
      if (detailsRef.current) {
        gsap.fromTo(
          detailsRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      }
    },
    { dependencies: [activeProject], scope: detailsRef },
  );

  const activeProj = detailedProjects[activeProject];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050508] py-24 px-6 md:px-12 flex flex-col items-center overflow-x-hidden"
    >
      {/* Reusable Background Canvas Component */}
      <StarfieldBackground starCount={85} speed={0.55} />

      {/* Cosmic glow filters */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl w-full mx-auto z-10 flex flex-col gap-10">
        {/* Navigation & Header Section */}
        <div className="header-section flex flex-col gap-5 border-b border-white/10 pb-6">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors duration-300 w-fit"
          >
            <svg
              className="size-4 text-teal-400 group-hover:-translate-x-1 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            <span>Back to Mission Control</span>
          </Link>

          <div>
            <span className="text-teal-400 font-mono text-xs uppercase tracking-widest">
              Mission Catalog
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mt-1.5">
              Developed Projects
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl font-sans leading-relaxed">
              Explore the engineering files of digital interfaces, IoT
              dashboards, and custom networking utilities. Review screenshot
              captures alongside the core design problems and architectural
              resolutions.
            </p>
          </div>
        </div>

        {/* Desktop Split-Pane Showcase Layout */}
        <div className="hidden lg:grid grid-cols-[380px_1fr] gap-12 items-start mt-4">
          {/* Left Column: Vertical Selector List */}
          <div className="sticky top-28 flex flex-col gap-4 z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 mb-1 px-1">
              Select Mission Record
            </span>
            <div className="flex flex-col gap-3">
              {detailedProjects.map((proj, idx) => {
                const isActive = activeProject === idx;
                return (
                  <button
                    key={idx + 1}
                    onClick={() => setActiveProject(idx)}
                    className={`project-selector-item group text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      isActive
                        ? "bg-white/[0.04] text-white border-white/20"
                        : "bg-white/[0.01] text-muted-foreground border-white/5 hover:bg-white/[0.03] hover:text-white"
                    }`}
                    style={{
                      boxShadow: isActive
                        ? `0 4px 20px -5px ${proj.catalogGlow}`
                        : "none",
                    }}
                  >
                    {/* Active vertical accent bar */}
                    <div
                      className={`absolute left-0 top-0 h-full w-[3px] transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        backgroundColor: proj.catalogGlow.replace(
                          /[^,]+(?=\))/,
                          "1",
                        ), // Make solid color
                      }}
                    />

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-teal-400/80">
                          {proj.subtitle}
                        </span>
                        <h3 className="text-lg font-bold transition-colors duration-200">
                          {proj.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs opacity-30">
                        /0{idx + 1}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Study Pane */}
          <div ref={detailsRef} className="showcase-panel flex flex-col gap-8">
            {/* Screenshot Frame */}
            <div
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/2 backdrop-blur-md transition-all duration-500 group shadow-2xl"
              style={{
                boxShadow: `0 30px 60px -15px ${activeProj.catalogGlow}`,
              }}
            >
              {/* Browser Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.03]">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-rose-500/40" />
                  <span className="size-3 rounded-full bg-amber-500/40" />
                  <span className="size-3 rounded-full bg-emerald-500/40" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-[#050508]/50 border border-white/5 rounded-lg px-4 py-1 text-center text-[10px] text-muted-foreground font-mono select-none truncate">
                  vignesh.dev/projects/
                  {activeProj.title.toLowerCase().replace(/\s+/g, "-")}
                </div>
                <div className="w-12" /> {/* spacer for center alignment */}
              </div>

              {/* Screenshot Media */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07070a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeProj.screenshotImage}
                  alt={`${activeProj.title} Screenshot`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Title & Description Details */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <span className="text-teal-400 font-mono text-xs uppercase tracking-widest">
                    {activeProj.subtitle}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
                    {activeProj.title}
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed font-sans max-w-4xl">
                {activeProj.description}
              </p>
            </div>

            {/* Problem & Solution Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {/* Challenge / Problem */}
              <div className="flex flex-col gap-3.5 p-6 rounded-2xl border border-rose-500/10 bg-rose-500/[0.015] backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-[3px] bg-rose-500/70" />
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>The Challenge</span>
                </div>
                <p className="text-muted-foreground/90 text-sm leading-relaxed font-sans">
                  {activeProj.problem}
                </p>
              </div>

              {/* Resolution / Solution */}
              <div className="flex flex-col gap-3.5 p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.015] backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-[3px] bg-emerald-500/70" />
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>The Resolution</span>
                </div>
                <p className="text-muted-foreground/90 text-sm leading-relaxed font-sans">
                  {activeProj.solution}
                </p>
              </div>
            </div>

            {/* Tech Stack Component */}
            <div className="flex flex-col gap-3 mt-2 border-t border-white/5 pt-6">
              <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground/60">
                Core Technologies Used
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProj.tech.map((t, techIdx) => (
                  <span
                    key={techIdx + 1}
                    className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/5 text-muted-foreground font-mono text-xs uppercase hover:text-white hover:border-white/10 transition-colors duration-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Responsive List Layout */}
        <div className="lg:hidden flex flex-col gap-10 mt-4">
          {detailedProjects.map((proj, idx) => (
            <div
              key={idx + 1}
              className="flex flex-col gap-6 p-6 rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-md shadow-lg"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-teal-400 font-mono text-[10px] uppercase tracking-widest">
                    {proj.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {proj.title}
                  </h3>
                </div>
                <span className="text-muted-foreground/30 font-mono text-sm">
                  /0{idx + 1}
                </span>
              </div>

              {/* Mock browser preview and screenshot */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/2 backdrop-blur-md shadow-xl"
                style={{
                  boxShadow: `0 15px 30px -10px ${proj.catalogGlow}`,
                }}
              >
                {/* Browser bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.03]">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500/40" />
                    <span className="size-2 rounded-full bg-amber-500/40" />
                    <span className="size-2 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="flex-1 max-w-[180px] mx-auto bg-[#050508]/50 border border-white/5 rounded px-2 py-0.5 text-center text-[9px] text-muted-foreground font-mono truncate">
                    {proj.title.toLowerCase().replace(/\s+/g, "-")}
                  </div>
                  <div className="w-8" />
                </div>
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07070a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.screenshotImage}
                    alt={`${proj.title} Screenshot`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                {proj.description}
              </p>

              {/* Problem & Solution Cards (Mobile Stack) */}
              <div className="flex flex-col gap-4">
                {/* Challenge */}
                <div className="flex flex-col gap-2.5 p-5 rounded-2xl border border-rose-500/10 bg-rose-500/[0.015] relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[3px] bg-rose-500/70" />
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
                    <svg
                      className="size-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    </svg>
                    <span>The Challenge</span>
                  </div>
                  <p className="text-muted-foreground/90 text-xs leading-relaxed font-sans">
                    {proj.problem}
                  </p>
                </div>

                {/* Resolution */}
                <div className="flex flex-col gap-2.5 p-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.015] relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[3px] bg-emerald-500/70" />
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
                    <svg
                      className="size-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>The Resolution</span>
                  </div>
                  <p className="text-muted-foreground/90 text-xs leading-relaxed font-sans">
                    {proj.solution}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                {proj.tech.map((t, techIdx) => (
                  <span
                    key={techIdx + 1}
                    className="px-2.5 py-1 rounded-full border border-white/5 bg-white/5 text-muted-foreground font-mono text-[10px] uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
