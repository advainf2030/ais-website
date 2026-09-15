import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

function getOffset(dir: Direction): { x: number; y: number } {
  switch (dir) {
    case 'up': return { x: 0, y: 40 };
    case 'down': return { x: 0, y: -40 };
    case 'left': return { x: 40, y: 0 };
    case 'right': return { x: -40, y: 0 };
  }
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const offset = getOffset(direction);

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
