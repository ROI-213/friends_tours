import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import '../../styles/cinematic-hero.css';

const FRAME_COUNT = 208;
const rawBase = import.meta.env.BASE_URL || '/';
const cleanBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
const FRAME_PATH = (n) => `${cleanBase}/hero-frames-2/ezgif-frame-${String(n).padStart(3, '0')}.jpg`;
const STATIC_FRAME = FRAME_PATH(208);

// Decoding every one of the 208 frames at once would hold ~700MB of bitmaps,
// so frames are cached as a bounded sliding window that follows the scroll
// position (LRU eviction outside the active window).
const WINDOW_RADIUS = 10;
const MAX_CACHED = 24;
const CONCURRENCY = 4;

// Maps `value` from [inMin, inMax] to [outMin, outMax], clamped to the output range.
function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMax;
  const t = (value - inMin) / (inMax - inMin);
  const clamped = Math.min(1, Math.max(0, t));
  return outMin + clamped * (outMax - outMin);
}

export const SecondHero = ({ onBookClick, onExploreServicesClick }) => {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const contentRef = useRef(null);

  const cacheRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const tickingRef = useRef(false);
  const rafIdRef = useRef(null);
  const refreshLoaderRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);

  // Preload & cache frames as a sliding window that follows the scroll
  // position. Frame 1 paints the moment it decodes; frames nearest the
  // current position load first (with a small concurrency pool), and far
  // frames are evicted so memory stays bounded.
  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    const cache = new Array(FRAME_COUNT);
    const loading = new Array(FRAME_COUNT).fill(false);
    const lastUsed = new Array(FRAME_COUNT).fill(0);
    cacheRef.current = cache;
    let loadedCount = 0;

    // Centered on the scroll TARGET, computed directly from the wrapper's own
    // position rather than read off targetFrameRef: this effect's 'scroll'
    // listener is registered before the animation effect's, so within a single
    // scroll event dispatch it would otherwise run first and see targetFrameRef
    // still holding the *previous* value. A large/fast scroll jump (trackpad
    // flick, scrollbar drag, Page Down) needs the destination frame loading
    // immediately, not one scroll event late, or the canvas freezes on a stale
    // frame because nothing near the real target was ever queued.
    const computeTargetFrame = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return 0;
      const rect = wrapper.getBoundingClientRect();
      const scrollableDistance = wrapper.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return 0;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      return progress * (FRAME_COUNT - 1);
    };
    const center = () => Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(computeTargetFrame())));
    const activeBounds = () => {
      const c = center();
      return [Math.max(0, c - WINDOW_RADIUS), Math.min(FRAME_COUNT - 1, c + WINDOW_RADIUS)];
    };

    let queue = [];
    let inFlight = 0;
    const rebuildQueue = () => {
      const [low, high] = activeBounds();
      const c = center();
      queue.length = 0;
      for (let i = low; i <= high; i++) {
        if (!loading[i] && !cache[i]) queue.push(i);
      }
      queue.sort((a, b) => (Math.abs(a - c) - Math.abs(b - c)) || (a - b));
    };

    const evictIfNeeded = () => {
      const [low, high] = activeBounds();
      while (loadedCount > MAX_CACHED) {
        let lru = -1;
        let lruTime = Infinity;
        for (let i = 0; i < FRAME_COUNT; i++) {
          if (!cache[i]) continue;
          if (i >= low && i <= high) continue;
          if (lastUsed[i] < lruTime) {
            lruTime = lastUsed[i];
            lru = i;
          }
        }
        if (lru === -1) break;
        cache[lru] = null;
        loadedCount -= 1;
      }
    };

    const pump = () => {
      let guard = 0;
      while (!cancelled && queue.length && guard < 64 && inFlight < CONCURRENCY) {
        const idx = queue.shift();
        guard += 1;
        if (idx == null || loading[idx] || cache[idx]) continue;

        loading[idx] = true;
        inFlight += 1;
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (cancelled) return;
          loading[idx] = false;
          inFlight -= 1;
          cache[idx] = img;
          lastUsed[idx] = Date.now();
          loadedCount += 1;
          evictIfNeeded();
          if (Math.round(currentFrameRef.current) === idx && !tickingRef.current) {
            drawFrame(img);
          }
          pump();
        };
        img.onerror = () => {
          loading[idx] = false;
          inFlight -= 1;
          pump();
        };
        img.src = FRAME_PATH(idx + 1);
      }
    };

    // Re-prioritize the load window on every animation frame (called from
    // `animate`) so the cache follows the *displayed* position as it eases
    // toward the target, not just the last scroll event.
    const refreshLoader = () => {
      rebuildQueue();
      pump();
    };
    refreshLoaderRef.current = refreshLoader;

    // Frame 1 first — paint it the instant it decodes.
    loading[0] = true;
    const first = new Image();
    first.decoding = 'sync';
    first.onload = () => {
      if (cancelled) return;
      loading[0] = false;
      cache[0] = first;
      lastUsed[0] = Date.now();
      loadedCount += 1;
      drawFrame(first);
      rebuildQueue();
      pump();
    };
    first.onerror = () => {
      loading[0] = false;
      rebuildQueue();
      pump();
    };
    first.src = FRAME_PATH(1);

    rebuildQueue();
    pump();

    return () => {
      cancelled = true;
      refreshLoaderRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  function getCanvasCtx() {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }

  function drawFrame(img) {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = getCanvasCtx();
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (displayWidth === 0 || displayHeight === 0) return;

    const targetW = Math.round(displayWidth * dpr);
    const targetH = Math.round(displayHeight * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Cover-fit: scale + center-crop the source frame so it fully fills the
    // canvas with no distortion, no black bars and no empty side space.
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = displayWidth / displayHeight;
    let sx, sy, sw, sh;
    if (imgRatio > canvasRatio) {
      sh = img.naturalHeight;
      sw = sh * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / canvasRatio;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, displayWidth, displayHeight);
  }

  function updateTextMotion(progress) {
    const setStyle = (el, opacity, translateY, extra = '') => {
      if (!el) return;
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px)${extra}`;
    };

    // Staged cinematic reveal across scroll progress (0 -> 1).
    const eyebrowOpacity = mapRange(progress, 0, 0.2, 0, 1);
    setStyle(eyebrowRef.current, eyebrowOpacity, mapRange(progress, 0, 0.2, 14, 0));

    const headingT = mapRange(progress, 0.2, 0.45, 0, 1);
    setStyle(headingRef.current, headingT, mapRange(progress, 0.2, 0.45, 26, 0));

    const descT = mapRange(progress, 0.45, 0.65, 0, 1);
    setStyle(descRef.current, descT, mapRange(progress, 0.45, 0.65, 20, 0));

    const ctaT = mapRange(progress, 0.65, 0.8, 0, 1);
    const ctaScale = mapRange(progress, 0.65, 0.8, 0.96, 1);
    setStyle(ctaRef.current, ctaT, mapRange(progress, 0.65, 0.8, 16, 0), ` scale(${ctaScale})`);

    // The vehicle becomes the dominant visual as we approach the final frame.
    const fadeOut = mapRange(progress, 0.8, 1, 1, 0.72);
    if (contentRef.current) contentRef.current.style.opacity = String(fadeOut);
  }

  // Manual pin: this project's global `overflow-x: hidden` on html/body forces
  // `overflow-y: auto` on body per spec, which makes body a scroll container and
  // breaks `position: sticky` for descendants. So the stage is pinned by hand.
  function updatePin(rectTop, scrollableDistance) {
    const stage = stageRef.current;
    if (!stage) return;
    if (scrollableDistance <= 0 || rectTop > 0) {
      stage.style.position = 'absolute';
      stage.style.top = '0px';
    } else if (rectTop > -scrollableDistance) {
      stage.style.position = 'fixed';
      stage.style.top = '0px';
    } else {
      stage.style.position = 'absolute';
      stage.style.top = `${scrollableDistance}px`;
    }
  }

  function computeProgress() {
    const wrapper = wrapperRef.current;
    if (!wrapper) return 0;
    const rect = wrapper.getBoundingClientRect();
    const scrollableDistance = wrapper.offsetHeight - window.innerHeight;
    updatePin(rect.top, scrollableDistance);
    if (scrollableDistance <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollableDistance));
  }

  function animate() {
    const target = targetFrameRef.current;
    let current = currentFrameRef.current;
    current += (target - current) * 0.1;

    const settled = Math.abs(target - current) < 0.02;
    current = settled ? target : current;
    currentFrameRef.current = current;

    const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(current)));
    refreshLoaderRef.current?.();
    const img = cacheRef.current[idx];
    if (img) drawFrame(img);

    updateTextMotion(current / (FRAME_COUNT - 1));

    if (!settled) {
      rafIdRef.current = requestAnimationFrame(animate);
    } else {
      tickingRef.current = false;
      rafIdRef.current = null;
    }
  }

  function requestTick() {
    if (!tickingRef.current) {
      tickingRef.current = true;
      rafIdRef.current = requestAnimationFrame(animate);
    }
  }

  function onScrollOrResize() {
    const progress = computeProgress();
    targetFrameRef.current = progress * (FRAME_COUNT - 1);
    requestTick();
  }

  useEffect(() => {
    if (reducedMotion) return;

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    onScrollOrResize();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      tickingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="second-hero"
        className="cine-hero cine-hero--static"
        aria-label="The Journey Begins — Friends Tours and Travels"
      >
        <div className="cine-hero-bg">
          <img src={STATIC_FRAME} alt="Suzuki sedan driving through a rainy Karnataka road at dusk" className="cine-hero-static-image" loading="eager" fetchPriority="high" />
          <div className="cine-hero-scrim" />
        </div>
        <CineContent onBookClick={onBookClick} onExploreServicesClick={onExploreServicesClick} static />
      </section>
    );
  }

  return (
    <section
      id="second-hero"
      className="cine-hero cine-hero-scroll-wrapper"
      ref={wrapperRef}
      aria-label="The Journey Begins — Friends Tours and Travels"
    >
      <div className="cine-hero-stage" ref={stageRef}>
        <div className="cine-hero-canvas-wrap">
          <canvas ref={canvasRef} className="cine-hero-canvas" />
          <div className="cine-hero-scrim" />
          <div className="cine-hero-glow" />
        </div>

        <div className="cine-hero-container" ref={contentRef}>
          <CineContent
            onBookClick={onBookClick}
            onExploreServicesClick={onExploreServicesClick}
            eyebrowRef={eyebrowRef}
            headingRef={headingRef}
            descRef={descRef}
            ctaRef={ctaRef}
          />
        </div>
      </div>
    </section>
  );
};

function CineContent({ onBookClick, onExploreServicesClick, eyebrowRef, headingRef, descRef, ctaRef, static: isStatic }) {
  const baseStyle = isStatic ? {} : { opacity: 0 };
  return (
    <div className="cine-hero-left">
      <div className="cine-hero-eyebrow" ref={eyebrowRef} style={baseStyle}>
        <span className="cine-hero-eyebrow-line" />
        <span>The Journey Begins</span>
      </div>

      <h2 className="cine-hero-heading" ref={headingRef} style={baseStyle}>
        EVERY ROAD.
        <span className="cine-hero-heading-highlight">HAS A STORY.</span>
      </h2>

      <p className="cine-hero-description" ref={descRef} style={baseStyle}>
        From Bangalore city streets to unforgettable journeys beyond the city, travel comfortably with Friends Tours &amp; Travels.
      </p>

      <div className="cine-hero-cta-group" ref={ctaRef} style={baseStyle}>
        <button className="btn-cine-primary" onClick={onExploreServicesClick} aria-label="Explore Our Services">
          <span>Explore Our Services</span>
          <ArrowRight size={17} />
        </button>

        <button className="btn-cine-secondary" onClick={onBookClick} aria-label="Book Your Journey">
          <span>Book Your Journey</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
