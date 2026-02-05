"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import clsx from "clsx";
import { useMemo } from "react";

// --- Section Component (uses parent's scrollYProgress) ---
function Section({
  start,
  end,
  children,
  align = "center",
  className,
  scrollProgress
}: {
  start: number;
  end: number;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  scrollProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollProgress,
    [start - 0.02, start + 0.03, end - 0.05, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollProgress,
    [start, start + 0.08, end - 0.08, end],
    [80, 0, 0, -80]
  );

  const alignClass = {
    left: "items-start text-left px-8 md:px-24 lg:px-32",
    center: "items-center text-center px-6",
    right: "items-end text-right px-8 md:px-24 lg:px-32"
  };

  return (
    <motion.div
      style={{ opacity, y }}
      className={clsx(
        "fixed inset-0 flex flex-col justify-center max-w-6xl mx-auto pointer-events-none",
        alignClass[align],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// --- Main Component with SINGLE scroll hook ---
export default function StoryOverlay() {
  // Single scroll hook for the entire overlay
  const { scrollYProgress } = useScroll();

  return (
    <div className="absolute inset-0 z-10">

      {/* HERO (0% - 15%) */}
      <Section start={0} end={0.15} align="center" scrollProgress={scrollYProgress}>
        <div className="flex flex-col items-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/40 mb-6">
            Introducing
          </p>
          <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter text-white leading-none">
            PRISM
          </h1>
          <p className="mt-6 text-2xl md:text-4xl text-white/70 font-light tracking-tight">
            Silence, perfected.
          </p>
        </div>
      </Section>

      {/* ENGINEERING (15% - 40%) */}
      <Section start={0.15} end={0.40} align="left" scrollProgress={scrollYProgress}>
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-medium uppercase tracking-[0.25em] text-accent-cyan mb-8">
            Acoustic Engineering
          </span>
          <h2 className="text-5xl md:text-7xl font-semibold text-white leading-[1.1] mb-8">
            Built for the{" "}
            <span className="text-white/40">pursuit of pure sound.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-lg">
            Each component is sculpted for clarity. From precision-tuned 40mm drivers to
            sealed acoustic chambers, every detail is optimized to deliver audio the way
            the artist intended.
          </p>
        </div>
      </Section>

      {/* NOISE CANCELLING (40% - 65%) */}
      <Section start={0.40} end={0.65} align="right" scrollProgress={scrollYProgress}>
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-medium uppercase tracking-[0.25em] text-accent-blue mb-8">
            Intelligent Silence
          </span>
          <h2 className="text-5xl md:text-7xl font-semibold text-white leading-[1.1] mb-10">
            The world fades.{" "}
            <span className="text-white/40">Your music stays.</span>
          </h2>
          <div className="space-y-5">
            <div className="flex items-center justify-end gap-4">
              <span className="text-base text-white/60">8 Microphones. 360° Awareness.</span>
              <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            </div>
            <div className="flex items-center justify-end gap-4">
              <span className="text-base text-white/60">Real-time Noise Analysis.</span>
              <span className="w-2 h-2 rounded-full bg-accent-blue" />
            </div>
            <div className="flex items-center justify-end gap-4">
              <span className="text-base text-white/60">Adaptive Transparency Mode.</span>
              <span className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </Section>

      {/* SOUND QUALITY (65% - 85%) */}
      <Section start={0.65} end={0.85} align="left" scrollProgress={scrollYProgress}>
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-medium uppercase tracking-[0.25em] text-white/30 mb-8">
            Sound Quality
          </span>
          <h2 className="text-5xl md:text-7xl font-semibold text-white leading-[1.1] mb-10">
            Every note.{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
              Every nuance.
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Hi-Res Audio</h4>
              <p className="text-sm text-white/40 leading-relaxed">
                Experience up to 40kHz frequency response. Hear the breath between notes.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-2">DSEE Extreme™</h4>
              <p className="text-sm text-white/40 leading-relaxed">
                AI upscaling restores rich detail to compressed audio in real time.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA (85% - 100%) */}
      <Section start={0.85} end={1.0} align="center" scrollProgress={scrollYProgress}>
        <div className="flex flex-col items-center">
          <h2 className="text-6xl md:text-8xl font-semibold text-white tracking-tight mb-6">
            Hear everything.
          </h2>
          <p className="text-xl md:text-2xl text-white/50 mb-12">
            Designed for focus. Crafted for all-day comfort.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5 pointer-events-auto">
            <Link href="/buy" className="px-10 py-4 rounded-full bg-white text-black font-semibold text-base transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
              Experience Prism
            </Link>
            <Link href="/specs" className="text-white/50 hover:text-white transition-colors font-medium">
              View Specs →
            </Link>
          </div>
        </div>
      </Section>

    </div>
  );
}
