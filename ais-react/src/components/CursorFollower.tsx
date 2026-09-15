import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Glassmorphic cursor follower — desktop only.
 * Grows on hover over interactive elements (buttons, links, cards).
 * Uses mix-blend-difference for premium inverting effect.
 */
export default function CursorFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 28 });
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    });
  }, [cursorX, cursorY]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onMouseMove]);

  useEffect(() => {
    const interactiveSelector = 'a, button, [role="button"], .glass-card, .glass-card-hover, input, textarea, select';

    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);

    const attachListeners = () => {
      document.querySelectorAll<HTMLElement>(interactiveSelector).forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    // Initial attach + re-attach on DOM changes
    attachListeners();
    const observer = new MutationObserver(() => attachListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll<HTMLElement>(interactiveSelector).forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <motion.div
      className={`cursor-follower ${hovering ? 'is-hovering' : ''}`}
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      aria-hidden="true"
    />
  );
}
