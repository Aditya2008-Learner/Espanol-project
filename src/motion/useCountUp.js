import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(value, { suffix = '', duration = 1.4 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      el.textContent = String(value);
      return undefined;
    }
    if (reduced) {
      el.textContent = `${numeric}${suffix}`;
      return undefined;
    }

    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: numeric,
      duration,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, scroller: document.querySelector('main'), start: 'top 85%', once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(state.n)}${suffix}`;
      },
    });

    return () => tween.kill();
  }, [value, suffix, duration, reduced]);

  return ref;
}
