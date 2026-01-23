"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface CanvasSequenceProps {
  frameCount: number;
}

export default function CanvasSequence({ frameCount }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll progress for the entire page container
  // We'll assume the parent container is very tall (e.g., 400vh)
  const { scrollYProgress } = useScroll();
  
  // Smooth the scroll progress to avoid jittery frame updates
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
        // Pad with zeros to 4 digits (e.g., 0001, 0002)
      const fileName = `/sequence/${i.toString().padStart(4, "0")}.jpg`;
      const img = new Image();
      img.src = fileName;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };
      imgs.push(img);
    }
    setImages(imgs);
  }, [frameCount]);

  // Render loop
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    
    // Resize observer to handle window resizing
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
    resize(); // Initial sizing

    const render = () => {
        // Map 0-1 scroll progress to 0-(frameCount-1) frame index
        const progress = smoothProgress.get();
        // Clamp between 0 and 1
        const clampedProgress = Math.min(Math.max(progress, 0), 0.999); 
        
        const frameIndex = Math.floor(clampedProgress * frameCount);
        const img = images[frameIndex];

        if (img) {
            const width = canvas.width / dpr; // Logical width
            const height = canvas.height / dpr; // Logical height
            
            // "Contain" logic: keep aspect ratio, center image
            const imgAspect = img.width / img.height;
            const canvasAspect = width / height;
            
            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                // Canvas is wider than image -> fit by height
                drawHeight = height;
                drawWidth = height * imgAspect;
                offsetX = (width - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Canvas is taller than image -> fit by width
                drawWidth = width;
                drawHeight = width / imgAspect;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            }

            // Clear and draw
            // The background is effectively transparent so the CSS background shows through (or we can fillRect)
            ctx.clearRect(0, 0, width, height); 
            
            // Optional: Fill background with #050505 to ensure edge blending if needed
            // ctx.fillStyle = "#050505";
            // ctx.fillRect(0, 0, width, height);
            
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
        
        requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);
    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationId);
    };
  }, [isLoaded, images, smoothProgress, frameCount]);

  if (!isLoaded) {
      return (
          <div className="fixed inset-0 flex items-center justify-center bg-[#050505] text-white/50 z-50">
              <div className="animate-pulse tracking-widest text-sm">LOADING EXPERIENCE...</div>
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
