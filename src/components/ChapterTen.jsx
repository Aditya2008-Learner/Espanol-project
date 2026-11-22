import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ChapterTen = () => {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = sectionRef.current;
    const scrollerEl = document.querySelector('main');

    if (!root || reduced || !scrollerEl) return undefined;

    const lines = root.querySelectorAll('.finale-line');
    const sweeps = root.querySelectorAll('.finale-sweep');

    const ctx = gsap.context(() => {
      if (lines.length > 0) {
        gsap.from(lines, {
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 75%' },
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.22,
          ease: 'power4.out',
        });
      }
      if (sweeps.length > 0) {
        gsap.fromTo(
          sweeps,
          { xPercent: -120 },
          {
            xPercent: 120,
            duration: 1.4,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 70%' },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden bg-black py-24">
      <img
        src="/assets/images/hero-stadium.webp"
        alt="Spain national team at stadium"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-gold">Capítulo 10 — El Final</p>
        <h2 className="mt-10 font-display text-4xl sm:text-6xl md:text-8xl leading-tight tracking-tight text-ivory">EL FÚTBOL NO SE EXPLICA.</h2>
        <h3 className="mt-3 font-display text-4xl sm:text-6xl md:text-8xl leading-tight tracking-tight text-gold">SE SIENTE.</h3>
        <p className="mx-auto mt-10 max-w-2xl font-serif text-xl text-ivory/75">
          Spanish football is a way of seeing space, time, and courage. The lesson ends where the feeling begins.
        </p>
        <button
          type="button"
          onClick={() => document.querySelector('main')?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          className="mt-12 border border-gold px-8 py-4 font-mono text-xs uppercase tracking-wider text-gold transition-colors hover:bg-gold hover:text-maroon"
        >
          Restart experience
        </button>
      </div>
    </section>
  );
};