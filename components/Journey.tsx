"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

import journeyDataRaw from "@/lib/data/journey.json";

interface JourneyItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
  color: string;
  glow: string;
  logoKey: string;
}

const journeyData = journeyDataRaw as JourneyItem[];

const getJourneyLogo = (logoKey: string) => {
  switch (logoKey) {
    case "founder":
      return (
        <svg
          className="w-5 h-5 text-teal-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
          <path d="M12 2v10" />
          <path d="m16 8-4 4-4-4" />
          <path d="M12 12v6" />
        </svg>
      );
    case "iot":
      return (
        <svg
          className="w-5 h-5 text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <path d="M12 8v8" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "fullstack":
      return (
        <svg
          className="w-5 h-5 text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
          <path d="M12 13v8" />
        </svg>
      );
    case "intern":
      return (
        <svg
          className="w-5 h-5 text-purple-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 17v-5H4v-2h5V5h2v5h5v2h-5v5z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Draw timeline line down on scroll
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 30%",
              end: "bottom 70%",
              scrub: 1,
            },
          },
        );
      }

      // 2. Animate cards entering (slide and fade)
      const items = containerRef.current?.querySelectorAll(".journey-item");
      items?.forEach((item) => {
        const card = item.querySelector(".journey-card");
        const node = item.querySelector(".journey-node");
        const isLeft = item.classList.contains("journey-item-left");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });

        if (node) {
          tl.fromTo(
            node,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" },
          );
        }

        if (card) {
          tl.fromTo(
            card,
            {
              x: isLeft ? -50 : 50,
              opacity: 0,
              scale: 0.9,
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.3",
          );
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="journey"
      className="w-full bg-[#050508] border-t border-border/10 px-6 md:px-12 py-24 relative overflow-hidden"
    >
      {/* Background neon glows */}
      <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 border-b border-white/10 pb-4">
          <span className="text-teal-400 font-mono text-xs uppercase tracking-widest">
            02 / Mission Log
          </span>
          <h2 className="text-3xl lg:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-1">
            Career Journey
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2 font-sans leading-relaxed">
            A chronological timeline of software development milestones,
            production deployments, and engineering leadership.
          </p>
        </div>

        {/* Timeline Path Container */}
        <div className="relative w-full mt-12 flex flex-col gap-12 lg:gap-16">
          {/* Vertical central line (drawn on scroll) */}
          <div
            className="absolute left-[20px] md:left-[19px] lg:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-teal-500 via-purple-500 to-blue-500 origin-top hidden md:block"
            ref={timelineLineRef}
            style={{ willChange: "transform" }}
          />
          {/* Static background line */}
          <div className="absolute left-[20px] md:left-[19px] lg:left-1/2 top-4 bottom-4 w-[2px] bg-white/5 hidden md:block" />

          {journeyData.map((item, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={idx + 1}
                className={`journey-item flex flex-col md:flex-row relative w-full ${
                  isLeft
                    ? "journey-item-left md:justify-start"
                    : "journey-item-right md:justify-end md:flex-row-reverse"
                }`}
              >
                {/* Timeline node dot */}
                <div
                  className="journey-node absolute left-[12px] md:left-[19px] lg:left-1/2 top-8 -translate-x-1/2 z-20 hidden md:flex items-center justify-center"
                  style={{ willChange: "transform, opacity" }}
                >
                  {/* Glowing central node */}
                  <span
                    className="w-3.5 h-3.5 rounded-full bg-black border-2 border-white/40 group-hover/item:border-white transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                    style={{
                      borderColor: item.color,
                      boxShadow: `0 0 10px ${item.glow}`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Experience Dossier Card */}
                <div
                  className={`journey-card w-full md:w-[45%] bg-gradient-to-br from-[#0c0c16]/85 to-[#05050b]/90 backdrop-blur-xl border border-white/5 hover:border-white/10 hover:shadow-2xl rounded-3xl p-6 lg:p-8 relative group transition-all duration-500 ${
                    isLeft ? "md:mr-auto" : "md:ml-auto"
                  }`}
                  style={{
                    willChange: "transform, opacity",
                    boxShadow: `0 10px 30px rgba(0,0,0,0.4)`,
                  }}
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {getJourneyLogo(item.logoKey)}
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-white tracking-tight leading-snug">
                          {item.company}
                        </h3>
                        <p className="text-xs text-teal-400/90 font-mono tracking-wider">
                          {item.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-[10px] tracking-wider uppercase">
                        {item.period}
                      </span>
                      <p className="text-[10px] text-muted-foreground/60 font-mono mt-1 uppercase">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Bullet description list */}
                  <ul className="mt-4 flex flex-col gap-2.5 text-muted-foreground text-xs lg:text-[13px] font-sans leading-relaxed list-none pl-0">
                    {item.description.map((desc, bulletIdx) => (
                      <li
                        key={bulletIdx + 1}
                        className="flex gap-2 items-start"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack badges footer */}
                  <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                    {item.skills.map((skill, skillIdx) => (
                      <span
                        key={skillIdx + 1}
                        className="px-2 py-0.5 rounded-md border border-white/5 bg-white/5 text-muted-foreground font-mono text-[9px] uppercase hover:text-white hover:border-white/10 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
