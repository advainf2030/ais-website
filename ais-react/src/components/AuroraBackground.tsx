import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4';

const VIDEO_POSTER =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=60';

/**
 * Fixed fullscreen background — 3-layer compositing:
 *   Layer A (bottom): Animated aurora gradient orbs with GSAP scroll parallax
 *   Layer B (middle): Dark code-texture video (conditionally loaded)
 *   Layer C (top):    Noise dot-pattern grain overlay
 *
 * Video is skipped when:
 *   - User prefers reduced motion
 *   - Browser signals Save-Data mode (navigator.connection.saveData)
 */
export default function AuroraBackground() {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = conn?.saveData === true;

    setShowVideo(!prefersReducedMotion && !saveData);
  }, []);

  /* Set non-standard webkit-playsinline attribute for iOS Safari autoplay */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute('webkit-playsinline', 'true');
    }
  }, [showVideo]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
        const speed = Number(el.dataset.drift ?? 10);
        gsap.to(el, {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  /* Reactive aurora — orbs drift toward the cursor with organic, staggered
     lag, so the background reads as "alive". Desktop + fine-pointer only;
     respects prefers-reduced-motion. Purely additive to the scroll drift
     above (separate transform properties, GSAP composites them safely). */
  useEffect(() => {
    const canReact = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canReact || reduceMotion) return;

    const orbs = gsap.utils.toArray<HTMLElement>('[data-mouse-strength]');
    if (!orbs.length) return;

    const setters = orbs.map((el) => {
      const strength = Number(el.dataset.mouseStrength ?? 20);
      const duration = Number(el.dataset.mouseLag ?? 1.4);
      return {
        strength,
        setX: gsap.quickTo(el, 'x', { duration, ease: 'power2.out' }),
        setY: gsap.quickTo(el, 'y', { duration, ease: 'power2.out' }),
      };
    });

    const handleMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      setters.forEach(({ strength, setX, setY }) => {
        setX(nx * strength);
        setY(ny * strength);
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FAFAFA] dark:bg-[#070b14] transition-colors duration-500"
    >
      {/* ─── Layer A: Aurora gradient orbs (base background colors) ─── */}
      {/* Primary emerald orb — top left */}
      <div
        data-drift="14"
        data-mouse-strength="26"
        data-mouse-lag="1.1"
        className="absolute -top-[14vw] -left-[12vw] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] blur-[130px] opacity-[0.32] dark:opacity-[0.12] will-change-transform animate-orb-1"
      />
      {/* Cyan-sky orb — top right */}
      <div
        data-drift="-12"
        data-mouse-strength="34"
        data-mouse-lag="1.6"
        className="absolute -top-[10vw] -right-[10vw] w-[56vw] h-[56vw] rounded-full bg-gradient-to-bl from-[#06B6D4] via-[#22D3EE] to-[#0284C7] blur-[130px] opacity-[0.35] dark:opacity-[0.12] will-change-transform animate-orb-2"
      />
      {/* Amber-warm orb — middle left */}
      <div
        data-drift="10"
        data-mouse-strength="18"
        data-mouse-lag="2.0"
        className="absolute top-[40vh] -left-[14vw] w-[54vw] h-[54vw] rounded-full bg-gradient-to-tr from-[#FDE68A] via-[#F59E0B] to-[#F97316] blur-[130px] opacity-[0.25] dark:opacity-[0.06] will-change-transform animate-orb-3"
      />
      {/* Teal-indigo blend — bottom right */}
      <div
        data-drift="-16"
        data-mouse-strength="30"
        data-mouse-lag="1.35"
        className="absolute top-[70vh] -right-[14vw] w-[58vw] h-[58vw] rounded-full bg-gradient-to-tl from-[#10B981] via-[#06B6D4] to-[#A5B4FC] blur-[130px] opacity-[0.28] dark:opacity-[0.10] will-change-transform animate-orb-4"
      />
      {/* Subtle center glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-gradient-radial from-cyan-200/15 dark:from-emerald-500/5 to-transparent blur-[80px]" />

      {/* ─── Layer B: Video texture (conditionally loaded) ─── */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={VIDEO_POSTER}
          className="absolute inset-0 w-full h-full object-cover opacity-[0.42] dark:opacity-[0.20] mix-blend-multiply dark:mix-blend-screen contrast-[1.15] pointer-events-none transform-gpu"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* ─── Layer C: Noise grain overlay (top) ─── */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] mix-blend-overlay bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:14px_14px]" />
    </div>
  );
}
