"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollToPlugin);

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80;
      gsap.to(globalThis, {
        duration: 1.5,
        scrollTo: {
          y: targetElement,
          offsetY: offset,
        },
        ease: "power3.inOut",
      });
      globalThis.history.pushState(null, "", href);
      setIsOpen(false);
    } else {
      router.push("/" + href);
    }
  };

  // Monitor scroll for glassmorphism background transitions
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation for initial entrance of the Navbar elements
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate navbar container slide down and fade in
      tl.fromTo(
        navContainerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
      );

      // Staggered animate the desktop links
      if (linksRef.current) {
        const linkElements = linksRef.current.querySelectorAll(".nav-link");
        tl.fromTo(
          linkElements,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.4",
        );
      }
    },
    { scope: navContainerRef },
  );

  // GSAP animation for opening/closing mobile menu
  useGSAP(() => {
    if (isOpen) {
      // Open animation
      gsap.to(mobileMenuRef.current, {
        clipPath: "circle(141.4% at 100% 0%)",
        duration: 0.6,
        ease: "power4.inOut",
      });
      // Stagger items inside mobile menu
      const items = mobileMenuRef.current?.querySelectorAll(".mobile-nav-link");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            delay: 0.2,
            ease: "power3.out",
          },
        );
      }
    } else {
      // Close animation
      gsap.to(mobileMenuRef.current, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.5,
        ease: "power4.inOut",
      });
    }
  }, [isOpen]);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "Journey", href: "#journey" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      ref={navContainerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-background/75 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="#home"
          onClick={(e) => handleScrollTo(e, "#home")}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <div className="flex items-center justify-center p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <HugeiconsIcon icon={SparklesIcon} className="size-5" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent group-hover:text-primary transition-all duration-300">
            Vignesh
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          ref={linksRef}
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="nav-link relative text-muted-foreground hover:text-foreground transition-colors duration-200 py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Action Button & Hamburger */}
        <div className="flex items-center gap-4">
          <Button
            className="hidden sm:inline-flex rounded-full px-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            variant="default"
            asChild
          >
            <Link
              href="#contact"
              onClick={(e) => handleScrollTo(e, "#contact")}
            >
              Get in Touch
            </Link>
          </Button>

          {/* Toggle Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <HugeiconsIcon
              icon={isOpen ? Cancel01Icon : Menu01Icon}
              className="size-5"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 top-0 left-0 w-full h-screen bg-background/98 z-40 flex flex-col justify-center px-8 md:hidden"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <nav className="flex flex-col gap-6 text-2xl font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="mobile-nav-link text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 border-b border-border/20 flex items-center justify-between"
            >
              <span>{link.label}</span>
              <span className="text-primary text-sm font-mono">
                /0{navLinks.indexOf(link) + 1}
              </span>
            </Link>
          ))}
          <div className="mobile-nav-link pt-4">
            <Button
              className="w-full rounded-2xl py-6 text-base"
              variant="default"
              asChild
            >
              <Link
                href="#contact"
                onClick={(e) => handleScrollTo(e, "#contact")}
              >
                Get in Touch
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
