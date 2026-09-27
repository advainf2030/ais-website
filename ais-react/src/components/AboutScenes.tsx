import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';

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

// Height of the *small* viewport (mobile toolbars shown), so pinned frames
// don't resize — and jump — as the address bar slides in and out.
function smallViewportHeight() {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;top:0;height:100svh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const h = probe.offsetHeight;
  probe.remove();
  return h || window.innerHeight;
}

interface Layout {
  nav: number;
  pin: boolean; // false = content taller than the screen: scrubbed without pinning
}

function useScene(id: string, extraVh: number, render: (p: number) => void) {
  const wrap = useRef<HTMLDivElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [alreadyPlayed] = useState(() => reducedMotion() || played.has(id));
  const [done, setDone] = useState(alreadyPlayed); // animation finished
  const [collapsed, setCollapsed] = useState(alreadyPlayed); // pinned space removed
  const [layout, setLayout] = useState<Layout | null>(null);
  const max = useRef(0);
  const anchor = useRef<{ el: Element; top: number } | null>(null);
  const renderRef = useRef(render);
  useEffect(() => {
    renderRef.current = render;
  });

  // Pin only when the content fits under the navbar. Re-measured on width
  // changes only: mobile toolbars change the height while scrolling.
  useLayoutEffect(() => {
    if (done) return; // the layout is frozen once the animation has played
    let lastWidth = -1;
    const measure = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      const nav = navHeight();
      const pin = (content.current?.offsetHeight ?? 0) <= smallViewportHeight() - nav - 12;
      setLayout((prev) => (prev && prev.nav === nav && prev.pin === pin ? prev : { nav, pin }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [done]);

  // Scrub: progress follows the scroll and only ever moves forward
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
      const st = stick.current;
      if (!w || !st) return;
      const r = w.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = layout!.pin
        ? // From the moment it locks under the navbar to the end of the pin
          (layout!.nav - r.top) / Math.max(1, w.offsetHeight - st.offsetHeight)
        : // Too tall to pin: starts once the top reaches mid-screen
          (vh * 0.55 - r.top) / Math.max(r.height, vh * 0.5);
      max.current = Math.max(max.current, clamp01(p));
      renderRef.current(max.current);
      if (max.current >= 1) {
        stop();
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

  // Once finished, the pin ends naturally (the next content scrolls up from
  // below). The extra pinned space is removed only while the scene is off
  // screen and scrolling has stopped — never mid-scroll, so smooth scrolls to
  // an anchor (e.g. "Contact us") still land where they were aimed.
  useEffect(() => {
    if (!done || collapsed || !layout?.pin) return; // unpinned scenes add no space
    let timer = 0;
    const tryCollapse = () => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r || (r.bottom > 0 && r.top < window.innerHeight)) return;
      // Keep whatever sits at the centre of the screen exactly where it is
      const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      anchor.current = el ? { el, top: el.getBoundingClientRect().top } : null;
      document.documentElement.style.overflowAnchor = 'none';
      setCollapsed(true);
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(tryCollapse, 220);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, [done, collapsed, layout]);

  useLayoutEffect(() => {
    if (!collapsed) return;
    const a = anchor.current;
    anchor.current = null;
    if (a && a.el.isConnected) {
      const delta = a.el.getBoundingClientRect().top - a.top;
      if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior });
    }
    document.documentElement.style.overflowAnchor = '';
  }, [collapsed]);

  const pinned = !collapsed && layout !== null && layout.pin;
  return { wrap, stick, content, done, pinned, layout, extraVh };
}

function SceneFrame({
  scene,
  clipX,
  backdrop,
  children,
}: {
  scene: ReturnType<typeof useScene>;
  clipX?: boolean;
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  const { wrap, stick, content, pinned, layout, extraVh } = scene;
  const nav = layout?.nav ?? 0;
  return (
    <div
      ref={wrap}
      className="relative [overflow-anchor:none]"
      style={pinned ? { height: `calc(100svh - ${nav}px + ${extraVh}svh)` } : undefined}
    >
      <div
        ref={stick}
        className={`${pinned ? 'sticky flex items-center' : 'relative'} ${clipX ? 'scene-clip' : ''}`}
        style={pinned ? { top: nav, height: `calc(100svh - ${nav}px)` } : undefined}
      >
        {backdrop}
        <div ref={content} className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

// Writes a style only when it changes (the scrub runs on every scroll frame)
function setStyle(el: HTMLElement, prop: 'opacity' | 'transform' | 'filter' | 'clipPath' | 'left', value: string) {
  if (el.style[prop] !== value) el.style[prop] = value;
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

  const scene = useScene(id, 190, (p) => {
    const fill = fillRef.current;
    const beam = beamRef.current;
    if (fill && beam) {
      const r = easeOut(range(p, 0.02, 0.32));
      const rtl = document.documentElement.dir === 'rtl';
      const hidden = `${((1 - r) * 100).toFixed(2)}%`;
      setStyle(fill, 'clipPath', rtl ? `inset(-10% -2% -10% ${hidden})` : `inset(-10% ${hidden} -10% -2%)`);
      setStyle(beam, 'left', `calc(${((rtl ? 1 - r : r) * 100).toFixed(2)}% - ${rtl ? 0 : 4}px)`);
      setStyle(beam, 'opacity', r > 0.01 && r < 0.99 ? '1' : '0');
    }
    const words = textRef.current?.querySelectorAll<HTMLSpanElement>('.lit-word');
    if (words) {
      const filled = range(p, 0.3, 0.97) * words.length;
      words.forEach((w, i) => setStyle(w, 'opacity', (0.16 + 0.84 * clamp01(filled - i)).toFixed(3)));
    }
  });
  const { done } = scene;

  return (
    <SceneFrame scene={scene}>
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
      <div ref={textRef} className="space-y-3">
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

  const scene = useScene(id, 190, (p) => {
    const head = headRef.current;
    if (head) {
      const z = easeOut(range(p, 0, 0.42));
      setStyle(head, 'transform', `scale(${(6 - 5 * z).toFixed(4)})`);
      setStyle(head, 'filter', z < 1 ? `blur(${((1 - z) * 14).toFixed(2)}px)` : '');
      setStyle(head, 'opacity', clamp01(range(p, 0, 0.08) * 1.2).toFixed(3));
    }
    const ghost = ghostRef.current;
    if (ghost) {
      setStyle(ghost, 'transform', `translate(${(-85 + p * 70).toFixed(2)}%, -50%)`);
      setStyle(ghost, 'opacity', (1 - range(p, 0.82, 1)).toFixed(3));
    }
    const words = textRef.current?.querySelectorAll<HTMLSpanElement>('.rise-word');
    if (words) {
      const filled = range(p, 0.42, 0.97) * words.length;
      words.forEach((w, i) => {
        const t = clamp01(filled - i);
        setStyle(w, 'opacity', (0.12 + 0.88 * t).toFixed(3));
        setStyle(w, 'transform', `translateY(${((1 - t) * 18).toFixed(2)}px)`);
      });
    }
  });
  const { done } = scene;

  return (
    <SceneFrame
      scene={scene}
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

/**
 * Image that eases in once — fades up while the photo settles from a slight
 * zoom — the first time it scrolls into view, and only after it has loaded,
 * so it never pops in half-drawn.
 */
export function RevealImage({
  id,
  className = '',
  imgClassName = '',
  ...img
}: {
  id: string;
  className?: string;
  imgClassName?: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [alreadyPlayed] = useState(() => reducedMotion() || played.has(id));
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const shown = alreadyPlayed || (inView && loaded);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
    if (alreadyPlayed || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [alreadyPlayed]);

  useEffect(() => {
    if (shown) played.add(id);
  }, [shown, id]);

  return (
    <div ref={ref} className={`img-reveal ${shown ? 'is-shown' : ''} ${className}`}>
      <img
        ref={imgRef}
        {...img}
        className={imgClassName}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
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
