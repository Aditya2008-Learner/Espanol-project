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

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll('.finale-line'), {
        scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 75%' },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.22,
        ease: 'power4.out',
      });
      gsap.fromTo(
        root.querySelectorAll('.finale-sweep'),
        { xPercent: -120 },
        {
          xPercent: 120,
          duration: 1.4,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 70%' },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden bg-black py-24">
      <img
        src="/assets/images/hero-stadium.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40" />
      <div className="finale-sweep pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="finale-line font-mono text-xs uppercase tracking-[0.35em] text-gold">Capítulo 10 — El Final</p>
        <h2 className="finale-line mt-10 font-display text-5xl tracking-tighter text-ivory md:text-8xl">EL FÚTBOL NO SE EXPLICA.</h2>
        <h3 className="finale-line mt-3 font-display text-5xl tracking-tighter text-gold md:text-8xl">SE SIENTE.</h3>
        <p className="finale-line mx-auto mt-10 max-w-2xl font-serif text-xl text-ivory/75">
          Spanish football is a way of seeing space, time, and courage. The lesson ends where the feeling begins.
        </p>
        <button
          type="button"
          onClick={() => document.querySelector('main')?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          className="finale-line mt-12 border border-gold px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-maroon"
        >
          Restart experience
        </button>
      </div>
    </section>
  );
};
