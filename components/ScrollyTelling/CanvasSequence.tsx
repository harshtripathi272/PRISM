"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useSpring, useMotionValueEvent } from "framer-motion";

interface CanvasSequenceProps {
  frameCount: number;
}

// Configuration for progressive loading
const INITIAL_LOAD_COUNT = 80;   // Load first 80 frames immediately
const CHUNK_SIZE = 60;           // Load 60 frames at a time
const PRELOAD_BUFFER = 120;      // Stay 120 frames ahead of current position

export default function CanvasSequence({ frameCount }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
  const loadingChunksRef = useRef<Set<number>>(new Set());
  const lastFrameRef = useRef<number>(-1);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  
  const [loadedCount, setLoadedCount] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { scrollYProgress } = useScroll();
  
  // Smoother spring settings - less stiffness = smoother animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
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
        // Pre-decode the image for smoother canvas drawing
        try {
          await img.decode();
        } catch (e) {
          // decode() might fail on some browsers, continue anyway
        }
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

  // Progressive loading based on scroll position - throttled
  useMotionValueEvent(smoothProgress, "change", (progress) => {
    const targetFrame = Math.floor(progress * (frameCount - 1));
    
    // Preload frames ahead
    const preloadStart = targetFrame;
    const preloadEnd = Math.min(targetFrame + PRELOAD_BUFFER, frameCount);

    for (let i = preloadStart; i < preloadEnd; i += CHUNK_SIZE) {
      const chunkStart = Math.floor(i / CHUNK_SIZE) * CHUNK_SIZE;
      if (!loadingChunksRef.current.has(Math.floor(chunkStart / CHUNK_SIZE))) {
        loadChunk(chunkStart);
      }
    }
  });

  // Setup canvas and render loop
  useEffect(() => {
    if (!initialLoadComplete || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { 
      alpha: false,  // No transparency = faster rendering
      desynchronized: true  // Reduce latency on supported browsers
    });
    if (!ctx) return;
    
    ctxRef.current = ctx;
    
    const dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Store dimensions to avoid recalculating every frame
      dimensionsRef.current = { width, height, dpr };
      
      // Reset scale after resize
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Force redraw after resize
      lastFrameRef.current = -1;
    };

    window.addEventListener('resize', resize);
    resize();

    let animationId: number;
    
    const render = () => {
      const progress = smoothProgress.get();
      const clampedProgress = Math.min(Math.max(progress, 0), 0.999);
      const frameIndex = Math.floor(clampedProgress * frameCount);
      
      // Skip render if same frame (major performance boost!)
      if (frameIndex === lastFrameRef.current) {
        animationId = requestAnimationFrame(render);
        return;
      }
      
      // Get the image for this frame
      let img = imagesRef.current[frameIndex];
      
      // If not loaded, find nearest loaded frame
      if (!img) {
        for (let offset = 1; offset < 30; offset++) {
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

        // Fill background first (faster than clearRect for full canvas)
        ctxRef.current.fillStyle = '#050505';
        ctxRef.current.fillRect(0, 0, width, height);
        
        // Draw the image
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

  // Loading screen with progress
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
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full object-contain pointer-events-none"
      style={{ 
        zIndex: 0,
        willChange: 'contents'  // Hint to browser for optimization
      }} 
    />
  );
}
