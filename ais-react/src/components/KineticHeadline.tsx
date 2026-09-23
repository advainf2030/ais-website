import { useEffect, useRef } from 'react';
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';

/**
 * Kinetic Scroll-Dissolve Headline
 *
 * Splits text into animation units and maps each unit's transform to a
 * shared scroll-progress MotionValue, staggered by index so the headline
 * disintegrates in sequence rather than all at once. Because every value
 * is a pure function of scroll position, scrolling back up reverses the
 * effect exactly — no extra state or timers involved.
 *
 * Arabic-safe by design: Arabic letters are cursive and only join into
 * their connected glyph forms when they share a text run. Splitting them
 * into individual <span>s (one per codepoint) breaks that shaping and
 * renders disconnected, broken-looking letters. So Arabic (and any other
 * RTL/cursive text) is split at the WORD level — each word stays one text
 * node and shapes correctly — while Latin text is split per grapheme for
 * a finer letter-by-letter dissolve. Both still read as fully "kinetic".
 */

function splitUnits(text: string, wordLevel: boolean): string[] {
  if (wordLevel) {
    return text.split(/(\s+)/).filter((s) => s.length > 0);
  }
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function KineticUnit({
  unit,
  index,
  total,
  progress,
  dissolveEnd,
  unitClassName,
}: {
  unit: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  dissolveEnd: number;
  unitClassName?: string;
}) {
  const start = total > 1 ? (index / total) * dissolveEnd : 0;
  const end = Math.min(start + dissolveEnd * 0.6, 1);

  // Deterministic per-unit variance (no Math.random — must stay identical between renders)
  const dir = index % 2 === 0 ? 1 : -1;
  const riseDistance = 34 + ((index * 13) % 40);
  const rotateXTarget = dir * (10 + ((index * 7) % 16));
  const rotateYTarget = -dir * (8 + ((index * 5) % 14));

  const y = useTransform(progress, [start, end], [0, -riseDistance]);
  const rotateX = useTransform(progress, [start, end], [0, rotateXTarget]);
  const rotateY = useTransform(progress, [start, end], [0, rotateYTarget]);
  const blurPx = useTransform(progress, [start, end], [0, 7]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  // Opacity is applied imperatively rather than through the `style` prop:
  // declaratively bound opacity was observed to stick at 1 past `end` even
  // though every other channel above clamps correctly. Driving it by hand
  // off the same progress subscription sidesteps that lifecycle interaction.
  const elRef = useRef<HTMLSpanElement>(null);
  const span = end - start || 1;
  const applyOpacity = (v: number) => {
    if (!elRef.current) return;
    const t = Math.min(Math.max((v - start) / span, 0), 1);
    elRef.current.style.opacity = String(1 - t);
  };
  useMotionValueEvent(progress, 'change', applyOpacity);
  useEffect(() => applyOpacity(progress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.span
      ref={elRef}
      className={unitClassName}
      style={{
        display: 'inline-block',
        y,
        rotateX,
        rotateY,
        filter,
        transformPerspective: 500,
      }}
    >
      {unit === ' ' ? ' ' : unit}
    </motion.span>
  );
}

export default function KineticHeadline({
  units,
  progress,
  startIndex,
  totalUnits,
  dissolveEnd = 0.6,
  className,
}: {
  // Pre-split by the caller (via `splitUnits`, exported below) so a headline
  // made of several segments — e.g. a plain run plus a gradient run — only
  // splits each string once instead of once per segment per render.
  units: string[];
  progress: MotionValue<number>;
  startIndex: number;
  totalUnits: number;
  dissolveEnd?: number;
  className?: string;
}) {
  return (
    <span>
      {units.map((unit, i) => (
        <KineticUnit
          key={i}
          unit={unit}
          index={startIndex + i}
          total={totalUnits}
          progress={progress}
          dissolveEnd={dissolveEnd}
          unitClassName={className}
        />
      ))}
    </span>
  );
}

export { splitUnits };
