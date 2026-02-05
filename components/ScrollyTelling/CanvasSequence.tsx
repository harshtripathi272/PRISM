"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useSpring, useMotionValueEvent } from "framer-motion";

interface CanvasSequenceProps {
  frameCount: number;
}

// Configuration for progressive loading
const INITIAL_LOAD_COUNT = 60;  // Load first 60 frames immediately
const CHUNK_SIZE = 50;          // Load 50 frames at a time
const PRELOAD_BUFFER = 80;      // Stay 80 frames ahead of current position

export default function CanvasSequence({ frameCount }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
  const loadingChunksRef = useRef<Set<number>>(new Set());

  const [loadedCount, setLoadedCount] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  // Get image path - using WebP format
  const getImagePath = useCallback((index: number) => {
    const frameNumber = (index + 1).toString().padStart(4, "0");
    return `/sequence-webp/${frameNumber}.webp`;
  }, []);

  // Load a single image
  const loadImage = useCallback((index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imagesRef.current[index]) {
        resolve(imagesRef.current[index]!);
        return;
      }

      const img = new Image();
      img.onload = () => {
        imagesRef.current[index] = img;
        setLoadedCount(prev => prev + 1);
        resolve(img);
      };
      img.onerror = reject;
      img.src = getImagePath(index);
    });
  }, [getImagePath]);

  // Load a chunk of images
  const loadChunk = useCallback(async (startIndex: number) => {
    const chunkId = Math.floor(startIndex / CHUNK_SIZE);

    // Avoid loading same chunk multiple times
    if (loadingChunksRef.current.has(chunkId)) return;
    loadingChunksRef.current.add(chunkId);

    const endIndex = Math.min(startIndex + CHUNK_SIZE, frameCount);
    const promises: Promise<HTMLImageElement>[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      if (!imagesRef.current[i]) {
        promises.push(loadImage(i));
      }
    }

    await Promise.all(promises);
  }, [frameCount, loadImage]);

  // Initial load - load first batch of frames
  useEffect(() => {
    const loadInitial = async () => {
      const promises: Promise<HTMLImageElement>[] = [];
      for (let i = 0; i < Math.min(INITIAL_LOAD_COUNT, frameCount); i++) {
        promises.push(loadImage(i));
      }
      await Promise.all(promises);
      setInitialLoadComplete(true);
    };

    loadInitial();
  }, [frameCount, loadImage]);

  // Progressive loading based on scroll position
  useMotionValueEvent(smoothProgress, "change", (progress) => {
    const targetFrame = Math.floor(progress * (frameCount - 1));
    setCurrentFrame(targetFrame);

    // Preload frames ahead
    const preloadStart = targetFrame;
    const preloadEnd = Math.min(targetFrame + PRELOAD_BUFFER, frameCount);

    // Load chunks needed for the preload range
    for (let i = preloadStart; i < preloadEnd; i += CHUNK_SIZE) {
      const chunkStart = Math.floor(i / CHUNK_SIZE) * CHUNK_SIZE;
      if (!loadingChunksRef.current.has(Math.floor(chunkStart / CHUNK_SIZE))) {
        loadChunk(chunkStart);
      }
    }
  });

  // Render loop
  useEffect(() => {
    if (!initialLoadComplete || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    let animationId: number;

    const render = () => {
      const progress = smoothProgress.get();
      const clampedProgress = Math.min(Math.max(progress, 0), 0.999);
      const frameIndex = Math.floor(clampedProgress * frameCount);

      // Find the best available frame (current or nearest loaded)
      let img = imagesRef.current[frameIndex];
      if (!img) {
        // Find nearest loaded frame
        for (let offset = 1; offset < 20; offset++) {
          if (imagesRef.current[frameIndex - offset]) {
            img = imagesRef.current[frameIndex - offset];
            break;
          }
          if (imagesRef.current[frameIndex + offset]) {
            img = imagesRef.current[frameIndex + offset];
            break;
          }
        }
      }

      if (img) {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
          drawHeight = height;
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = width;
          drawHeight = width / imgAspect;
          offsetX = 0;
          offsetY = (height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [initialLoadComplete, smoothProgress, frameCount]);

  // Loading screen with progress
  if (!initialLoadComplete) {
    const loadProgress = Math.round((loadedCount / INITIAL_LOAD_COUNT) * 100);

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-50">
        <div className="text-white/50 tracking-widest text-sm mb-8">
          LOADING EXPERIENCE
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-200 ease-out"
            style={{ width: `${loadProgress}%` }}
          />
        </div>

        <div className="text-white/30 text-xs mt-4 font-mono">
          {loadProgress}%
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full object-contain pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
