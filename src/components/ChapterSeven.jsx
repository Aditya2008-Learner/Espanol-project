import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { legendsData } from '../data/footballData';
import { useReducedMotion } from '../motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ChapterSeven = () => {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const reduced = useReducedMotion();
  const active = legendsData[activeIdx];

  /* ── ScrollTrigger reveals ── */
  useLayoutEffect(() => {
    const root = sectionRef.current;
    const scrollerEl = document.querySelector('main');
    if (!root || !scrollerEl) return undefined;

    /* Always start visible in case trigger never fires */
    gsap.set(root.querySelectorAll('.leg-label, .leg-heading, .leg-card, .leg-panel'), {
      opacity: 1, y: 0, clearProps: 'filter',
    });

    if (reduced) return undefined;

    /* Animate from hidden → visible on scroll */
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('.leg-label'),
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 80%', once: true },
        }
      );
      gsap.fromTo(
        root.querySelectorAll('.leg-heading'),
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power4.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 78%', once: true },
        }
      );
      gsap.fromTo(
        root.querySelectorAll('.leg-card'),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.045, ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 72%', once: true },
        }
      );
      gsap.fromTo(
        root.querySelectorAll('.leg-panel'),
        { opacity: 0 },
        {
          opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 68%', once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#190A10] bg-noise py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Chapter label */}
        <div className="leg-label mb-4 inline-flex items-center gap-3 border border-[#D5AA61]/30 bg-[#350D19]/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#D5AA61]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#B51F35]" />
          Capítulo 07 — Leyendas
        </div>
        <h2 className="leg-heading font-display text-5xl tracking-tighter text-[#F4EFE5] md:text-8xl">
          LEGENDS OF <span className="text-[#D5AA61]">THE GAME</span>
        </h2>
        <p className="mt-4 max-w-xl font-serif text-lg italic text-[#F4EFE5]/60">
          Ten figures who defined what Spanish football looks, feels, and means.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">

          {/* Left — name list */}
          <nav className="flex flex-wrap gap-2 lg:col-span-4 lg:flex-col lg:gap-0 lg:border-l lg:border-[#350D19]">
            {legendsData.map((legend, i) => (
              <button
                key={legend.name}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`leg-card w-full text-left transition-all duration-300 lg:border-b lg:border-[#350D19] lg:py-4 lg:pl-6 ${
                  activeIdx === i
                    ? 'border-l-2 border-[#B51F35] bg-[#350D19]/60 pl-4 lg:pl-6'
                    : 'pl-4 text-[#F4EFE5]/50 hover:text-[#F4EFE5]/90 lg:pl-6'
                }`}
              >
                <p
                  className={`font-display text-xl transition-colors ${
                    activeIdx === i ? 'text-[#D5AA61]' : ''
                  }`}
                >
                  {legend.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#D5AA61]/60">
                  {legend.role}
                </p>
              </button>
            ))}
          </nav>

          {/* Right — detailed profile */}
          <div className="leg-panel lg:col-span-8">
            <div className="relative overflow-hidden border border-[#350D19] bg-[#350D19]/30">
              {/* Image */}
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#350D19]">
                <img
                  src={active.image}
                  alt={active.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top opacity-70 transition-opacity duration-700"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#190A10] via-[#190A10]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#D5AA61]">{active.role}</p>
                  <h3 className="mt-1 font-display text-5xl text-[#F4EFE5]">{active.name}</h3>
                  <p className="font-mono text-sm text-[#F4EFE5]/60">{active.club}</p>
                </div>
              </div>

              {/* Stats & detail */}
              <div className="grid gap-0 md:grid-cols-2">
                <div className="space-y-5 border-[#350D19] p-8 md:border-r">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#D5AA61]">Major Honours</p>
                    <p className="mt-2 font-serif text-base text-[#F4EFE5]/85">{active.achievements}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#D5AA61]">Playing Style</p>
                    <p className="mt-2 font-serif text-base italic text-[#F4EFE5]/75">{active.style}</p>
                  </div>
                </div>
                <div className="space-y-5 p-8">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#D5AA61]">Defining Moment</p>
                    <p className="mt-2 font-serif text-base text-[#F4EFE5]/85">{active.moment}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#D5AA61]">In Their Words</p>
                    <blockquote className="mt-2 border-l-2 border-[#B51F35] pl-4 font-serif text-base italic text-[#F4EFE5]/70">
                      "{active.quote}"
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Prev / Next nav */}
              <div className="flex items-center justify-between border-t border-[#350D19] px-8 py-4">
                <button
                  type="button"
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx(activeIdx - 1)}
                  className="font-mono text-xs uppercase tracking-widest text-[#D5AA61]/70 disabled:opacity-30 hover:text-[#D5AA61] transition-colors"
                >
                  ← Previous
                </button>
                <p className="font-mono text-xs text-[#F4EFE5]/30">
                  {activeIdx + 1} / {legendsData.length}
                </p>
                <button
                  type="button"
                  disabled={activeIdx === legendsData.length - 1}
                  onClick={() => setActiveIdx(activeIdx + 1)}
                  className="font-mono text-xs uppercase tracking-widest text-[#D5AA61]/70 disabled:opacity-30 hover:text-[#D5AA61] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
