import { useEffect, useRef, useState } from 'react';


const DESKTOP_VIDEO = {
  src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4',
  // First frame of the clip itself, so the backdrop looks the same while the
  // 13.5 MB video is still loading (an unrelated stock photo showed before).
  poster: 'videos/bg-desktop-poster.webp',
};
// Portrait centre crop of the same clip, 600x800 (~440 KB vs ~13.5 MB): phones
// only ever show that middle strip under object-cover. Poster is its first frame.
const MOBILE_VIDEO = {
  src: 'videos/bg-mobile.mp4',
  poster: 'videos/bg-mobile-poster.webp',
};

/**
 * Fixed fullscreen background — 3-layer compositing:
 *   Layer A (bottom): Animated aurora gradient orbs (CSS float animation)
 *   Layer B (middle): Dark code-texture video (conditionally loaded)
 *   Layer C (top):    Noise dot-pattern grain overlay
 *
 * Video is skipped when:
 *   - User prefers reduced motion
 *   - Browser signals Save-Data mode (navigator.connection.saveData)
 */
export default function AuroraBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Mounted only after the page has finished loading so it never competes
  // with first paint; phones get the lightweight portrait encode.
  const [video, setVideo] = useState<{ src: string; poster: string; mobile: boolean } | null>(null);
  const showVideo = video !== null;
  // Set when the OS refuses autoplay (iOS Low Power Mode): swap the <video>
  // for its poster image, or Safari draws a play button over the page.
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = conn?.saveData === true;
    if (prefersReducedMotion || saveData) return;
    const desktop = window.matchMedia('(min-width: 1024px)').matches;

    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(
        () => setVideo(desktop ? { ...DESKTOP_VIDEO, mobile: false } : { ...MOBILE_VIDEO, mobile: true }),
        1200,
      );
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      window.clearTimeout(timer);
    };
  }, []);

  /* Safari only autoplays when the `muted` *attribute* is present, and React
     sets `muted` as a DOM property without writing the attribute — so Safari
     treated the video as unmuted and refused to play it. Set both, then start
     playback explicitly. If the OS still refuses (e.g. iOS Low Power Mode),
     the poster image stays as a static background. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('webkit-playsinline', 'true');
    v.play().catch(() => setBlocked(true));
  }, [showVideo]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#EEF2F7] dark:bg-[#070b14] transition-colors duration-500"
    >
      {/* ─── Layer A: Aurora gradient orbs (base background colors) ─── */}
      {/* Primary emerald orb — top left */}
      <div
        className="absolute -top-[14vw] -left-[12vw] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#3AB8FF] via-[#0556CB] to-[#0B3D91] blur-[130px] opacity-[0.32] dark:opacity-[0.12] will-change-transform animate-orb-1"
      />
      {/* Cyan-sky orb — top right */}
      <div
        className="absolute -top-[10vw] -right-[10vw] w-[56vw] h-[56vw] rounded-full bg-gradient-to-bl from-[#00AEEF] via-[#17AEFA] to-[#0556CB] blur-[130px] opacity-[0.35] dark:opacity-[0.12] will-change-transform animate-orb-2"
      />
      {/* Amber-warm orb — middle left */}
      <div
        className="absolute top-[40vh] -left-[14vw] w-[54vw] h-[54vw] rounded-full bg-gradient-to-tr from-[#C7EEFD] via-[#8FD3FF] to-[#3AB8FF] blur-[130px] opacity-[0.25] dark:opacity-[0.06] will-change-transform animate-orb-3"
      />
      {/* Teal-indigo blend — bottom right */}
      <div
        className="absolute top-[70vh] -right-[14vw] w-[58vw] h-[58vw] rounded-full bg-gradient-to-tl from-[#0556CB] via-[#00AEEF] to-[#B9D1F6] blur-[130px] opacity-[0.28] dark:opacity-[0.10] will-change-transform animate-orb-4"
      />
      {/* Subtle center glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-gradient-radial from-sky-200/15 dark:from-sky-500/5 to-transparent blur-[80px]" />

      {/* ─── Layer B: Video texture (conditionally loaded) ─── */}
      {video && blocked && (
        <img
          src={video.poster}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover ${
            video.mobile ? 'opacity-[0.3] dark:opacity-[0.14]' : 'opacity-[0.42] dark:opacity-[0.20]'
          } mix-blend-multiply dark:mix-blend-screen contrast-[1.15] pointer-events-none`}
        />
      )}
      {video && !blocked && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={video.poster}
          className={`absolute inset-0 w-full h-full object-cover ${
            video.mobile ? 'opacity-[0.3] dark:opacity-[0.14]' : 'opacity-[0.42] dark:opacity-[0.20]'
          } mix-blend-multiply dark:mix-blend-screen contrast-[1.15] pointer-events-none transform-gpu`}
        >
          <source src={video.src} type="video/mp4" />
        </video>
      )}

      {/* ─── Layer C: Noise grain overlay (top) ─── */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] mix-blend-overlay bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:14px_14px]" />
    </div>
  );
}
