import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4';

/**
 * Fixed fullscreen background — 3-layer compositing:
 *   Layer A (bottom): Dark code-texture video — opacity 0.12, mix-blend-difference
 *   Layer B (middle): Animated aurora gradient orbs with GSAP scroll parallax
 *   Layer C (top):    Noise dot-pattern grain overlay
 *
 * Base canvas is #FAFAFA — the site stays light-mode.
 * mix-blend-difference inverts the video's dark pixels into subtle light patterns.
 */
export default function AuroraBackground() {
  const root = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FAFAFA]"
    >
      {/* ─── Layer A: Video texture (bottom) ─── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.2] mix-blend-multiply pointer-events-none"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ─── Layer B: Aurora gradient orbs (middle) ─── */}
      {/* Primary emerald orb — top left */}
      <div
        data-drift="14"
        className="absolute -top-[14vw] -left-[12vw] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] blur-[130px] opacity-[0.32] will-change-transform animate-orb-1"
      />
      {/* Cyan-sky orb — top right */}
      <div
        data-drift="-12"
        className="absolute -top-[10vw] -right-[10vw] w-[56vw] h-[56vw] rounded-full bg-gradient-to-bl from-[#06B6D4] via-[#22D3EE] to-[#0284C7] blur-[130px] opacity-[0.35] will-change-transform animate-orb-2"
      />
      {/* Amber-warm orb — middle left */}
      <div
        data-drift="10"
        className="absolute top-[40vh] -left-[14vw] w-[54vw] h-[54vw] rounded-full bg-gradient-to-tr from-[#FDE68A] via-[#F59E0B] to-[#F97316] blur-[130px] opacity-[0.25] will-change-transform animate-orb-3"
      />
      {/* Teal-indigo blend — bottom right */}
      <div
        data-drift="-16"
        className="absolute top-[70vh] -right-[14vw] w-[58vw] h-[58vw] rounded-full bg-gradient-to-tl from-[#10B981] via-[#06B6D4] to-[#A5B4FC] blur-[130px] opacity-[0.28] will-change-transform animate-orb-4"
      />
      {/* Subtle center glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-gradient-radial from-cyan-200/15 to-transparent blur-[80px]" />

      {/* ─── Layer C: Noise grain overlay (top) ─── */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:14px_14px]" />
    </div>
  );
}
