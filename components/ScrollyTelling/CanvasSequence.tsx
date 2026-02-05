"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useSpring } from "framer-motion";

interface CanvasSequenceProps {
  frameCount: number;
}

// Load first 100 frames before showing content, then load rest in background
const INITIAL_LOAD_COUNT = 100;

export default function CanvasSequence({ frameCount }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
  const lastFrameRef = useRef<number>(-1);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  const [loadedCount, setLoadedCount] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const { scrollYProgress } = useScroll();

  // Smoother spring settings
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.0001
  });

  // Get image path - using WebP format
  const getImagePath = useCallback((index: number) => {
    const frameNumber = (index + 1).toString().padStart(4, "0");
    return `/sequence-webp/${frameNumber}.webp`;
  }, []);

  // Load a single image with decode() for smoother rendering
  const loadImage = useCallback((index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imagesRef.current[index]) {
        resolve(imagesRef.current[index]!);
        return;
      }

      const img = new Image();
      img.onload = async () => {
        try {
          await img.decode();
        } catch (e) {
          // decode() might fail on some browsers, continue anyway
        }
        imagesRef.current[index] = img;
        setLoadedCount(prev => prev + 1);
        resolve(img);
      };
      img.onerror = () => {
        // On error, still resolve to not block other loads
        resolve(img);
      };
      img.src = getImagePath(index);
    });
  }, [getImagePath]);

  // Phase 1: Load initial frames
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

  // Phase 2: Load ALL remaining frames in background after initial load
  useEffect(() => {
    if (!initialLoadComplete) return;

    const loadRemaining = async () => {
      // Load in batches to not overwhelm the browser
      const BATCH_SIZE = 30;

      for (let batch = INITIAL_LOAD_COUNT; batch < frameCount; batch += BATCH_SIZE) {
        const promises: Promise<HTMLImageElement>[] = [];
        const endIndex = Math.min(batch + BATCH_SIZE, frameCount);

        for (let i = batch; i < endIndex; i++) {
          if (!imagesRef.current[i]) {
            promises.push(loadImage(i));
          }
        }

        await Promise.all(promises);

        // Small delay between batches to keep UI responsive
        await new Promise(r => setTimeout(r, 50));
      }

      setAllLoaded(true);
    };

    loadRemaining();
  }, [initialLoadComplete, frameCount, loadImage]);

  // Setup canvas and render loop
  useEffect(() => {
    if (!initialLoadComplete || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true
    });
    if (!ctx) return;

    ctxRef.current = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      dimensionsRef.current = { width, height, dpr };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastFrameRef.current = -1;
    };

    window.addEventListener('resize', resize);
    resize();

    let animationId: number;

    const render = () => {
      const progress = smoothProgress.get();
      const clampedProgress = Math.min(Math.max(progress, 0), 0.999);
      const frameIndex = Math.floor(clampedProgress * frameCount);

      // Skip render if same frame
      if (frameIndex === lastFrameRef.current) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // Get the image - find best available
      let img = imagesRef.current[frameIndex];

      if (!img) {
        // Find nearest loaded frame - search wider range
        for (let offset = 1; offset < 50; offset++) {
          const prevFrame = imagesRef.current[frameIndex - offset];
          if (prevFrame) {
            img = prevFrame;
            break;
          }
          const nextFrame = imagesRef.current[frameIndex + offset];
          if (nextFrame) {
            img = nextFrame;
            break;
          }
        }
      }

      if (img && ctxRef.current) {
        const { width, height } = dimensionsRef.current;
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

        ctxRef.current.fillStyle = '#050505';
        ctxRef.current.fillRect(0, 0, width, height);
        ctxRef.current.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        lastFrameRef.current = frameIndex;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [initialLoadComplete, smoothProgress, frameCount]);

  // Loading screen
  if (!initialLoadComplete) {
    const loadProgress = Math.round((loadedCount / INITIAL_LOAD_COUNT) * 100);

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-50">
        <div className="text-white/50 tracking-widest text-sm mb-8">
          LOADING EXPERIENCE
        </div>

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
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full object-contain pointer-events-none"
        style={{ zIndex: 0, willChange: 'contents' }}
      />

      {/* Background loading indicator - subtle, non-blocking */}
      {!allLoaded && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          <span className="text-white/50 text-xs">
            Loading: {Math.round((loadedCount / frameCount) * 100)}%
          </span>
        </div>
      )}
    </>
  );
}
