"use client";

import { useEffect, useRef } from "react";

interface StarfieldBackgroundProps {
  starCount?: number;
  speed?: number;
  canvasClassName?: string;
}

export default function StarfieldBackground({
  starCount = 85,
  speed = 0.55,
  canvasClassName = "fixed inset-0 w-full h-full pointer-events-none z-0",
}: Readonly<StarfieldBackgroundProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const stars: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1500,
        z: Math.random() * width,
      });
    }

    const draw = () => {
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      stars.forEach((star) => {
        const prevZ = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * 1500;
          star.y = (Math.random() - 0.5) * 1500;
        }

        const scale = 200;
        const px = (star.x / star.z) * scale + centerX;
        const py = (star.y / star.z) * scale + centerY;
        const prevPx = (star.x / prevZ) * scale + centerX;
        const prevPy = (star.y / prevZ) * scale + centerY;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);

          const opacity = Math.min(0.6, (1 - star.z / width) * 0.5);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [starCount, speed]);

  return <canvas ref={canvasRef} className={canvasClassName} />;
}
