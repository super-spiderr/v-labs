"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface SectionMascotProps {
  src: string;
  className?: string;
  triggerId: string;
  animationType: "drop-spin" | "slide-laptop" | "wave-drop";
  scale?: number;
  isActive: boolean;
}

export default function SectionMascot({
  src,
  className = "",
  animationType,
  scale = 1,
  isActive,
}: Readonly<SectionMascotProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !imgRef.current) return;

      const parent = containerRef.current.parentElement;
      const parentHeight = parent ? parent.clientHeight : 800;

      // Reset loop animations and set off-screen position when section is inactive
      if (!isActive) {
        gsap.killTweensOf(containerRef.current);
        gsap.killTweensOf(imgRef.current);

        if (animationType === "drop-spin") {
          gsap.set(containerRef.current, {
            y: -parentHeight - 100,
            opacity: 0,
            scale: scale,
          });
          gsap.set(imgRef.current, {
            rotation: -180,
          });
        } else if (animationType === "slide-laptop") {
          gsap.set(containerRef.current, {
            y: -350,
            opacity: 0,
            scale: scale,
          });
          gsap.set(imgRef.current, {
            rotation: -15,
          });
        } else if (animationType === "wave-drop") {
          gsap.set(containerRef.current, {
            y: -300,
            opacity: 0,
            scale: scale,
          });
          gsap.set(imgRef.current, {
            rotation: 0,
          });
        }
        return;
      }

      // Play entrance landing animation when section becomes active
      const tl = gsap.timeline();

      if (animationType === "drop-spin") {
        tl.to(containerRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power2.in",
        });

        tl.to(
          imgRef.current,
          {
            rotation: 0,
            duration: 1.1,
            ease: "power2.inOut",
          },
          "<",
        );

        tl.to(containerRef.current, {
          scaleY: scale * 0.7,
          scaleX: scale * 1.25,
          duration: 0.15,
          ease: "power1.out",
        });
        tl.to(containerRef.current, {
          scaleY: scale * 1.1,
          scaleX: scale * 0.9,
          y: -25,
          duration: 0.25,
          ease: "power2.out",
        });
        tl.to(containerRef.current, {
          scaleY: scale,
          scaleX: scale,
          y: 0,
          duration: 0.2,
          ease: "back.out(1.5)",
          onComplete: () => {
            gsap.to(containerRef.current, {
              y: "-=12",
              duration: 4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        });
      }

      if (animationType === "slide-laptop") {
        tl.to(containerRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.3,
          ease: "back.out(1.3)",
        });

        tl.to(
          imgRef.current,
          {
            rotation: 0,
            duration: 1.3,
            ease: "back.out(1.3)",
          },
          "<",
        );

        tl.to(containerRef.current, {
          scaleY: scale * 0.85,
          duration: 0.15,
          ease: "power1.out",
        });
        tl.to(containerRef.current, {
          scaleY: scale,
          duration: 0.3,
          ease: "back.out(1.5)",
          onComplete: () => {
            gsap.to(containerRef.current, {
              y: "-=8",
              x: "+=6",
              duration: 5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        });
      }

      if (animationType === "wave-drop") {
        tl.to(containerRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "bounce.out",
          onComplete: () => {
            gsap.to(containerRef.current, {
              y: "-=12",
              duration: 4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            gsap.to(imgRef.current, {
              rotation: 12,
              duration: 0.6,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        });
      }
    },
    { dependencies: [isActive], scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none z-10 ${className}`}
    >
      <div className="relative w-full h-full">
        {/* Subtle neon glowing circle behind mascot */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-teal-500/10 to-purple-500/10 blur-xl opacity-60 pointer-events-none" />
        <Image
          ref={imgRef}
          src={src}
          alt="Mascot character"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
        />
      </div>
    </div>
  );
}
