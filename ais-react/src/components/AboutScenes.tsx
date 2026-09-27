import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

/*
 * Scroll scenes for the About tab, built to match the approved demo:
 *  - "Who we are" (BeamScene): the heading is uncovered behind a light beam,
 *    then the text lights up word by word.
 *  - "Vision" / "Mission" (ZoomScene): the heading starts huge and blurred and
 *    settles into place while a giant ghost of the word drifts behind it, then
 *    the text rises in word by word.
 * Each scene pins in the middle of the screen and is scrubbed by the scroll,
 * so it only moves while the visitor scrolls. It plays once: progress never
 * rewinds, and when it completes the pinned scroll space is removed (the page
 * is shifted by the same amount, so nothing on screen moves) and the section
 * stays as normal text for the rest of the visit.
 */

const played = new Set<string>();
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const navHeight = () => document.querySelector<HTMLElement>('[data-site-nav]')?.offsetHeight ?? 0;

interface Layout {
  nav: number;
  extra: number; // px of pinned scroll; 0 = content taller than the screen, not pinned
}

function useScene(id: string, extraVh: number, render: (p: number) => void) {
  const wrap = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(() => reducedMotion() || played.has(id));
  const [layout, setLayout] = useState<Layout | null>(null);
  const max = useRef(0);
  const anchor = useRef<number | null>(null);
  const renderRef = useRef(render);
  useEffect(() => {
    renderRef.current = render;
  });

  // Pin only when the content fits on screen under the navbar
  useLayoutEffect(() => {
    if (done) return;
    const measure = () => {
      const nav = navHeight();
      const vh = window.innerHeight;
      const h = content.current?.offsetHeight ?? 0;
      const extra = h <= vh - nav - 24 ? Math.round((vh * extraVh) / 100) : 0;
      setLayout((prev) => (prev && prev.nav === nav && prev.extra === extra ? prev : { nav, extra }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [done, extraVh]);

  useEffect(() => {
    if (done || !layout) return;
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    function update() {
      frame = 0;
      const w = wrap.current;
      if (!w) return;
      const r = w.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        layout!.extra > 0
          ? // Pinned: from the moment it locks under the navbar to the end of the pin
            (layout!.nav - r.top) / layout!.extra
          : // Too tall to pin: starts once the top reaches mid-screen
            (vh * 0.55 - r.top) / Math.max(r.height, vh * 0.5);
      max.current = Math.max(max.current, clamp01(p));
      renderRef.current(max.current);
      if (max.current >= 1) {
        stop();
        anchor.current = content.current?.getBoundingClientRect().top ?? null;
        played.add(id);
        setDone(true);
      }
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      stop();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [done, layout, id]);

  // Remove the pinned space without moving what's on screen
  useLayoutEffect(() => {
    if (!done || anchor.current === null || !content.current) return;
    const delta = content.current.getBoundingClientRect().top - anchor.current;
    anchor.current = null;
    if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior });
  }, [done]);

  const pinned = !done && layout !== null && layout.extra > 0;
  return { wrap, content, done, pinned, layout };
}

function SceneFrame({
  wrap,
  content,
  pinned,
  layout,
  clipX,
  backdrop,
  children,
}: {
  wrap: RefObject<HTMLDivElement | null>;
  content: RefObject<HTMLDivElement | null>;
  pinned: boolean;
  layout: Layout | null;
  clipX?: boolean;
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  const nav = layout?.nav ?? 0;
  return (
    <div
      ref={wrap}
      className="relative [overflow-anchor:none]"
      style={pinned ? { height: `calc(100vh - ${nav}px + ${layout!.extra}px)` } : undefined}
    >
      <div
        className={`${pinned ? 'sticky flex items-center' : 'relative'} ${clipX ? 'scene-clip' : ''}`}
        style={pinned ? { top: nav, height: `calc(100vh - ${nav}px)` } : undefined}
      >
        {backdrop}
        <div ref={content} className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── A: beam reveal + word-by-word light-up ── */
export function BeamScene({
  id,
  title,
  subtitle,
  paragraphs,
  titleClassName,
  subtitleClassName,
  paragraphClassName,
}: {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  titleClassName: string;
  subtitleClassName?: string;
  paragraphClassName: string;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const beamRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { wrap, content, done, pinned, layout } = useScene(id, 190, (p) => {
    const fill = fillRef.current;
    const beam = beamRef.current;
    if (fill && beam) {
      const r = easeOut(range(p, 0.02, 0.32));
      const rtl = document.documentElement.dir === 'rtl';
      const hidden = `${((1 - r) * 100).toFixed(2)}%`;
      fill.style.clipPath = rtl ? `inset(-10% -2% -10% ${hidden})` : `inset(-10% ${hidden} -10% -2%)`;
      beam.style.left = `calc(${((rtl ? 1 - r : r) * 100).toFixed(2)}% - ${rtl ? 0 : 4}px)`;
      beam.style.opacity = r > 0.01 && r < 0.99 ? '1' : '0';
    }
    const words = textRef.current?.querySelectorAll<HTMLSpanElement>('.lit-word');
    if (words) {
      const filled = range(p, 0.3, 0.97) * words.length;
      words.forEach((w, i) => {
        w.style.opacity = String(0.16 + 0.84 * clamp01(filled - i));
      });
    }
  });

  return (
    <SceneFrame wrap={wrap} content={content} pinned={pinned} layout={layout}>
      <h2 className={`reveal-h ${done ? 'is-done' : ''} ${titleClassName}`}>
        <span className="rh-ghost">{title}</span>
        {!done && (
          <>
            <span ref={fillRef} className="rh-fill" aria-hidden="true">
              {title}
            </span>
            <span ref={beamRef} className="rh-beam" aria-hidden="true" />
          </>
        )}
      </h2>
      {subtitle && <h3 className={subtitleClassName}>{subtitle}</h3>}
      <div ref={textRef} className="space-y-4">
        {paragraphs.map((para, i) => (
          <p key={i} className={paragraphClassName}>
            {done ? para : splitInline(para)}
          </p>
        ))}
      </div>
    </SceneFrame>
  );
}

/* ── C: giant zoom-through + drifting ghost word + words rising in ── */
export function ZoomScene({
  id,
  title,
  text,
  titleClassName,
  paragraphClassName,
}: {
  id: string;
  title: string;
  text: string;
  titleClassName: string;
  paragraphClassName: string;
}) {
  const headRef = useRef<HTMLHeadingElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const { wrap, content, done, pinned, layout } = useScene(id, 190, (p) => {
    const head = headRef.current;
    if (head) {
      const z = easeOut(range(p, 0, 0.42));
      head.style.transform = `scale(${(6 - 5 * z).toFixed(4)})`;
      head.style.filter = z < 1 ? `blur(${((1 - z) * 14).toFixed(2)}px)` : '';
      head.style.opacity = String(clamp01(range(p, 0, 0.08) * 1.2));
    }
    const ghost = ghostRef.current;
    if (ghost) {
      ghost.style.transform = `translate(${(-85 + p * 70).toFixed(2)}%, -50%)`;
      ghost.style.opacity = String(1 - range(p, 0.82, 1));
    }
    const words = textRef.current?.querySelectorAll<HTMLSpanElement>('.rise-word');
    if (words) {
      const filled = range(p, 0.42, 0.97) * words.length;
      words.forEach((w, i) => {
        const t = clamp01(filled - i);
        w.style.opacity = String(0.12 + 0.88 * t);
        w.style.transform = `translateY(${((1 - t) * 18).toFixed(2)}px)`;
      });
    }
  });

  return (
    <SceneFrame
      wrap={wrap}
      content={content}
      pinned={pinned}
      layout={layout}
      clipX
      backdrop={
        !done && (
          <div ref={ghostRef} className="zoom-ghost" aria-hidden="true">
            {title}
          </div>
        )
      }
    >
      <h3 ref={headRef} className={`zoom-title grad-text ${done ? '' : 'will-change-transform'} ${titleClassName}`}>
        {title}
      </h3>
      <p ref={textRef} className={paragraphClassName}>
        {done ? text : splitRising(text)}
      </p>
    </SceneFrame>
  );
}

/* Words, never letters: splitting Arabic into letters breaks the joins. */
function splitInline(text: string) {
  return text.split(/(\s+)/).map((part, i) =>
    /^\s*$/.test(part) ? (
      part
    ) : (
      <span key={i} className="lit-word">
        {part}
      </span>
    ),
  );
}

/* Rising words need inline-block (for the transform). Inside Arabic text,
   separate inline-blocks would lay consecutive Latin words out right-to-left
   ("Limited Bandit City"), so those runs are kept together in one piece. */
function splitRising(text: string) {
  const arabic = /[؀-ۿ]/.test(text);
  const tokens: string[] = [];
  text.split(/\s+/).forEach((w) => {
    const latin = arabic && /^[A-Za-z][A-Za-z.&-]*$/.test(w);
    const prev = tokens[tokens.length - 1];
    if (latin && prev !== undefined && /^[A-Za-z]/.test(prev)) tokens[tokens.length - 1] = `${prev} ${w}`;
    else tokens.push(w);
  });
  return tokens.map((w, i) => (
    <span key={i}>
      <span className="rise-word" dir={/^[A-Za-z]/.test(w) && arabic ? 'ltr' : undefined}>
        {w}
      </span>
      {i < tokens.length - 1 ? ' ' : ''}
    </span>
  ));
}
