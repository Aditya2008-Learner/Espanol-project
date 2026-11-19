import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ProgressBar = () => {
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    const el = progressRef.current;
    const scrollerEl = document.querySelector('main');
    if (!el || !scrollerEl) return undefined;

    const tween = gsap.to(el, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: scrollerEl,
        scroller: scrollerEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.scroller === scrollerEl && st.vars.trigger === scrollerEl) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-maroon/30 pointer-events-none">
      <div ref={progressRef} className="h-full w-0 bg-gradient-to-r from-crimson to-gold origin-left" />
    </div>
  );
};
