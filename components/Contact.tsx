"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import contactData from "@/lib/data/contact.json";

interface ContactLink {
  label: string;
  value: string;
  href: string;
  iconKey: string;
}

const getContactIcon = (iconKey: string) => {
  switch (iconKey) {
    case "email":
      return (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "github":
      return (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

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
    },
    { scope: containerRef },
  );

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate sending message
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  const contactLinks: ContactLink[] = contactData.links;

  return (
    <section
      ref={containerRef}
      id="contact"
      className="min-h-screen bg-[#080808] border-t border-white/5 px-6 md:px-12 py-32 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto flex flex-col gap-16 z-10">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 animate-fade-in">
          <div>
            <span className="text-teal-400 font-mono text-xs uppercase tracking-widest">
              03 / Connection
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">
              Get In Touch
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-sm mt-4 md:mt-0 font-sans leading-relaxed">
            {contactData.tagline}
          </p>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in relative">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {contactData.heading}
            </h3>
            <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
              {contactData.description}
            </p>

            <div className="flex flex-col gap-4 mt-4">
              {contactLinks.map((link, idx) => (
                <a
                  key={idx + 1}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/5 text-muted-foreground group-hover:text-teal-400 group-hover:scale-105 transition-all duration-300">
                      {getContactIcon(link.iconKey)}
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                        {link.label}
                      </span>
                      <p className="text-white text-sm font-medium mt-0.5">
                        {link.value}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="size-4 text-muted-foreground group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 animate-fade-in">
            <form
              onSubmit={handleSubmit}
              className="relative rounded-3xl border border-white/5 bg-white/2 backdrop-blur-md p-8 md:p-10 flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label
                    htmlFor="name"
                    className="text-xs text-muted-foreground uppercase font-mono tracking-wider"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white font-sans text-sm focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/20 transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label
                    htmlFor="email"
                    className="text-xs text-muted-foreground uppercase font-mono tracking-wider"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white font-sans text-sm focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/20 transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-xs text-muted-foreground uppercase font-mono tracking-wider"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white font-sans text-sm focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/20 transition-all duration-300 resize-none"
                  placeholder="Hey, let's talk about..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 rounded-xl bg-teal-500 text-black font-semibold text-sm hover:bg-teal-400 transition-all duration-300 shadow-lg shadow-teal-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === "idle" && "Send Message"}
                {status === "sending" && "Sending..."}
                {status === "success" && "Message Sent ✓"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
