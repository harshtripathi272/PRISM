# PRISM Website - Performance Optimizations

This document outlines the performance optimizations implemented in the PRISM scrollytelling website.

---

## 1. Image Format Conversion (JPG → WebP)

All 452 frame images were converted from JPG to WebP format.

| Format | Total Size | Reduction |
|--------|-----------|-----------|
| Original JPG | 44.62 MB | — |
| WebP (quality 60) | 36.65 MB | ~18% |

**Location**: `/public/sequence-webp/`

**Command used**:
```powershell
ffmpeg -i "sequence/%04d.jpg" -c:v libwebp -quality 60 "sequence-webp/%04d.webp"
```

---

## 2. Progressive Image Loading

Instead of loading all 452 images at once (which blocked the UI), we implemented a two-phase loading strategy:

### Phase 1: Initial Load
- Load **first 100 frames** before showing the content
- User sees a loading progress bar during this phase
- Once complete, the experience becomes interactive

### Phase 2: Background Loading
- Remaining 352 frames load in **batches of 30**
- Small delay (50ms) between batches to keep UI responsive
- Subtle loading indicator in bottom-right shows progress
- User can start scrolling immediately after Phase 1

**Configuration** (in `CanvasSequence.tsx`):
```typescript
const INITIAL_LOAD_COUNT = 100;  // Frames loaded before interaction
const BATCH_SIZE = 30;           // Frames per background batch
```

---

## 3. Image Pre-Decoding

Each image is pre-decoded using the `HTMLImageElement.decode()` API before being stored:

```typescript
img.onload = async () => {
  await img.decode();  // Pre-decode for smoother canvas drawing
  imagesRef.current[index] = img;
};
```

This ensures images are ready for immediate canvas rendering without decode lag.

---

## 4. Canvas Rendering Optimizations

### Frame Skipping
Only re-render when the frame actually changes:
```typescript
if (frameIndex === lastFrameRef.current) {
  animationId = requestAnimationFrame(render);
  return;  // Skip redundant draw
}
```

### Optimized Canvas Context
```typescript
canvas.getContext("2d", {
  alpha: false,        // No transparency = faster
  desynchronized: true // Reduce latency
});
```

### Cached Dimensions
Canvas dimensions are cached in a ref to avoid recalculating every frame:
```typescript
dimensionsRef.current = { width, height, dpr };
```

### DPI Capping
Device pixel ratio is capped at 2x to prevent excessive canvas size on high-DPI displays:
```typescript
const dpr = Math.min(window.devicePixelRatio || 1, 2);
```

---

## 5. Smooth Spring Animation

Scroll progress uses Framer Motion's `useSpring` for smooth, physics-based animation:

```typescript
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 80,    // Lower = smoother
  damping: 25,      // Controls oscillation
  restDelta: 0.0001 // Precision threshold
});
```

---

## 6. StoryOverlay Optimization

The text overlay component was optimized by:

1. **Single useScroll hook** - Consolidated from 5 separate hooks to 1
2. **Removed heavy animations** - Eliminated `whileInView` and `staggerChildren` variants during scroll
3. **Kept opacity/transform** - Only essential scroll-linked transforms remain

---

## 7. Next.js Configuration

Added build-time optimizations in `next.config.ts`:

```typescript
const nextConfig = {
  output: 'standalone',
  compress: true,
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,  // 1 year cache
  },
  headers: () => [{
    source: '/sequence-webp/:path*',
    headers: [{
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable'
    }]
  }]
};
```

---

## Summary of Improvements

| Metric | Before | After |
|--------|--------|-------|
| Initial Download | ~45 MB (all at once) | ~8 MB (100 frames) |
| Total Image Size | 44.62 MB | 36.65 MB |
| Load Strategy | Blocking | Progressive |
| Scroll Hooks | 6 (5 in overlay + 1 in canvas) | 2 (1 each) |
| Canvas Re-renders | Every frame | Only on frame change |

---

## Files Modified

- `components/ScrollyTelling/CanvasSequence.tsx` - Progressive loading, canvas optimizations
- `components/ScrollyTelling/StoryOverlay.tsx` - Single scroll hook, removed heavy animations
- `next.config.ts` - Build optimizations and caching
- `public/sequence-webp/` - Converted WebP images
