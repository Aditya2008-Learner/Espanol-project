import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../motion/useReducedMotion';

/**
 * Persistent stadium atmosphere: two soft floodlights and a subtle vignette
 * whose intensity shifts as the active chapter changes. Purely decorative —
 * pointer-events-none, sits below the header/rail, never covers text centre.
 */

// Per-chapter light temperature: left gold intensity, right crimson intensity.
// Chapters 1 (hero), 4 (El Clásico) and 10 (finale) feel brightest.
const LIGHT_BY_CHAPTER = {
  'chapter-1': { gold: 0.30, crimson: 0.22 },
  'chapter-2': { gold: 0.16, crimson: 0.10 },
  'chapter-3': { gold: 0.14, crimson: 0.12 },
  'chapter-4': { gold: 0.22, crimson: 0.26 },
  'chapter-5': { gold: 0.26, crimson: 0.12 },
  'chapter-6': { gold: 0.10, crimson: 0.10 },
  'chapter-7': { gold: 0.18, crimson: 0.10 },
  'chapter-8': { gold: 0.14, crimson: 0.12 },
  'chapter-9': { gold: 0.08, crimson: 0.06 },
  'chapter-10': { gold: 0.24, crimson: 0.20 },
};

const DEFAULT_LIGHT = { gold: 0.12, crimson: 0.10 };

export function Atmosphere() {
  const [active, setActive] = useState('chapter-1');
  const reduced = useReducedMotion();

  useEffect(() => {
    const nodes = Object.keys(LIGHT_BY_CHAPTER)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: document.querySelector('main'), threshold: [0.35, 0.55, 0.75] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const gold = document.getElementById('atmo-gold');
    const crimson = document.getElementById('atmo-crimson');
    if (!gold || !crimson || reduced) return undefined;

    const { gold: g, crimson: c } = LIGHT_BY_CHAPTER[active] || DEFAULT_LIGHT;
    gsap.to(gold, { opacity: g, duration: 1.6, ease: 'sine.inOut' });
    gsap.to(crimson, { opacity: c, duration: 1.6, ease: 'sine.inOut' });
    return undefined;
  }, [active, reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* Subtle directional light washes - no radial blobs */}
      <div
        id="atmo-gold"
        className="absolute top-0 left-[-10%] h-full w-[30%] bg-gradient-to-r from-gold/15 to-transparent"
      />
      <div
        id="atmo-crimson"
        className="absolute top-0 right-[-10%] h-full w-[30%] bg-gradient-to-r from-transparent to-crimson/15"
      />
      {/* Ambient vignette for depth, not color blob */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
