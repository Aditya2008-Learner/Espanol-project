import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useChapterReveal(scopeRef) {
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = scopeRef.current;
    const scroller = document.querySelector('main');
    if (!root || !scroller) return undefined;

    if (reduced) {
      gsap.set(root.querySelectorAll('.chapter-label, .section-title, .reveal-block'), { opacity: 1, y: 0, clearProps: 'filter' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const labels = root.querySelectorAll('.chapter-label');
      if (labels.length > 0) {
        gsap.from(labels, {
          scrollTrigger: { trigger: root, scroller, start: 'top 78%' },
          opacity: 0,
          y: 18,
          duration: 0.7,
          ease: 'power3.out',
        });
      }

      const words = root.querySelectorAll('.word-reveal');
      if (words.length > 0) {
        gsap.from(words, {
          scrollTrigger: { trigger: root, scroller, start: 'top 72%' },
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: 'power4.out',
        });
      } else {
        const titles = root.querySelectorAll('.section-title');
        if (titles.length > 0) {
          gsap.from(titles, {
            scrollTrigger: { trigger: root, scroller, start: 'top 72%' },
            opacity: 0,
            y: 36,
            duration: 1,
            ease: 'power4.out',
          });
        }
      }

      const blocks = root.querySelectorAll('.reveal-block');
      if (blocks.length > 0) {
        gsap.from(blocks, {
          scrollTrigger: { trigger: root, scroller, start: 'top 68%' },
          opacity: 0,
          y: 28,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }

      root.querySelectorAll('.clip-reveal').forEach((el) => {
        if (el) {
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
        }
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, scopeRef]);
}
