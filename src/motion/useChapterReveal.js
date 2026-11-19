import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useChapterReveal(scopeRef) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = scopeRef.current;
    if (!root) return undefined;

    if (reduced) {
      gsap.set(root.querySelectorAll('.chapter-label, .section-title, .reveal-block'), { opacity: 1, y: 0, clearProps: 'filter' });
      return undefined;
    }

    const scroller = document.querySelector('main');
    const ctx = gsap.context(() => {
      gsap.from('.chapter-label', {
        scrollTrigger: { trigger: root, scroller, start: 'top 78%' },
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'power3.out',
      });

      const words = root.querySelectorAll('.word-reveal');
      if (words.length) {
        gsap.from(words, {
          scrollTrigger: { trigger: root, scroller, start: 'top 72%' },
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: 'power4.out',
        });
      } else {
        gsap.from('.section-title', {
          scrollTrigger: { trigger: root, scroller, start: 'top 72%' },
          opacity: 0,
          y: 36,
          duration: 1,
          ease: 'power4.out',
        });
      }

      gsap.from('.reveal-block', {
        scrollTrigger: { trigger: root, scroller, start: 'top 68%' },
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      });

      root.querySelectorAll('.clip-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(12% 8% 12% 8%)', scale: 1.06 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, scroller, start: 'top 82%' },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, scopeRef]);
}
