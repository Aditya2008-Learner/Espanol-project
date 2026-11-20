import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(value, { suffix = '', duration = 1.4 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    const scroller = document.querySelector('main');
    if (!el || !scroller) return undefined;

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
    const ctx = gsap.context(() => {
      gsap.to(state, {
        n: numeric,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, scroller, start: 'top 85%', once: true },
        onUpdate: () => {
          if (el) {
            el.textContent = `${Math.round(state.n)}${suffix}`;
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, suffix, duration, reduced]);

  return ref;
}
