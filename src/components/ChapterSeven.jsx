import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { legendsData } from '../data/footballData';
import { WordTitle } from './WordTitle';
import { useChapterReveal } from '../motion/useChapterReveal';
import { useReducedMotion } from '../motion/useReducedMotion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LEGEND_CONFIG = {
  "Andrés Iniesta": { position: "center 22%", fit: "object-cover" },
  "Xavi Hernández": { position: "center 25%", fit: "object-cover" },
  "Iker Casillas": { position: "center 20%", fit: "object-cover" },
  "Sergio Ramos": { position: "center 20%", fit: "object-cover" },
  "Carles Puyol": { position: "center 22%", fit: "object-cover" },
  "David Villa": { position: "center 25%", fit: "object-cover" },
  "Fernando Torres": { position: "center center", fit: "object-contain" },
  "Raúl González": { position: "center center", fit: "object-contain" },
  "Sergio Busquets": { position: "center center", fit: "object-contain" },
  "Lamine Yamal": { position: "center 20%", fit: "object-cover" }
};

export const ChapterSeven = () => {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const nameRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const reduced = useReducedMotion();
  const active = legendsData[activeIdx];
  useChapterReveal(sectionRef);

  // Cinematic portrait reveal / crossfade on legend change
  useLayoutEffect(() => {
    if (reduced) return;
    const img = portraitRef.current;
    const nameEl = nameRef.current;
    if (!img || !nameEl) return;

    gsap.fromTo(
      img,
      { scale: 1.06, opacity: 0.4 },
      { scale: 1, opacity: 0.9, duration: 0.65, ease: 'power2.out' }
    );
    gsap.fromTo(
      nameEl,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, [activeIdx, reduced]);

  // Keyboard navigation for legends
  useEffect(() => {
    const handleKeyDown = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect && rect.top <= window.innerHeight && rect.bottom >= 0) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          setActiveIdx((prev) => (prev === 0 ? legendsData.length - 1 : prev - 1));
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          setActiveIdx((prev) => (prev === legendsData.length - 1 ? 0 : prev + 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const config = LEGEND_CONFIG[active.name] || { position: 'center 20%', fit: 'object-cover' };

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#190A10] bg-noise py-24">
      <div className="mx-auto max-w-7xl px-6">

         {/* Chapter label */}
        <div className="leg-label mb-4 inline-flex items-center gap-2 border border-gold/30 bg-burgundy/80 px-4 py-2 font-mono text-xs uppercase tracking-wide text-gold">
          <span className="h-2 w-2 rounded-full bg-crimson" />
          Capítulo 07 — Leyendas
        </div>
        <h2 className="leg-heading font-display text-4xl sm:text-6xl md:text-8xl leading-tight tracking-tight text-ivory py-1">
          LEGENDS OF <span className="text-gold">THE GAME</span>
        </h2>
        <p className="mt-4 max-w-xl font-serif text-lg text-ivory/60">
          Ten figures who defined what Spanish football looks, feels, and means.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">

          {/* Left — name list */}
          <nav aria-label="Football legends navigation" className="flex flex-wrap gap-2 lg:col-span-4 lg:flex-col lg:gap-0 lg:border-l lg:border-[#350D19]">
            {legendsData.map((legend, i) => (
              <button
                key={legend.name}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`leg-card w-full text-left transition-all duration-300 lg:border-b lg:border-[#350D19] lg:py-4 lg:pl-6 rounded-sm ${
                  activeIdx === i
                    ? 'border-l-2 border-[#B51F35] bg-[#350D19]/70 pl-4 lg:pl-6 shadow-md'
                    : 'pl-4 text-[#F4EFE5]/50 hover:text-[#F4EFE5]/90 hover:bg-white/5 lg:pl-6'
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
            <div className="relative overflow-hidden border border-[#350D19] bg-[#350D19]/30 rounded-sm shadow-2xl">
              {/* Image with object-contain for Torres, Raúl, Busquets */}
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-[#12050b] flex items-center justify-center">
                <img
                  ref={portraitRef}
                  src={active.image}
                  alt={active.name}
                  loading="lazy"
                  className={`h-full w-full ${config.fit} opacity-90 transition-transform duration-700 hover:scale-105`}
                  style={{ objectPosition: config.position }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#190A10] via-[#190A10]/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#D5AA61]">{active.role}</p>
                  <h3 ref={nameRef} className="mt-1 font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-[#F4EFE5] py-1">{active.name}</h3>
                  <p className="font-mono text-sm text-[#F4EFE5]/70">{active.club}</p>
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
              <div className="flex items-center justify-between border-t border-[#350D19] px-8 py-4 bg-[#190A10]/60">
                <button
                  type="button"
                  onClick={() => setActiveIdx((prev) => (prev === 0 ? legendsData.length - 1 : prev - 1))}
                  className="group inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#D5AA61]/70 hover:text-[#D5AA61] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Previous Legend</span>
                </button>
                <p className="font-mono text-xs text-[#F4EFE5]/40">
                  {activeIdx + 1} / {legendsData.length}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveIdx((prev) => (prev === legendsData.length - 1 ? 0 : prev + 1))}
                  className="group inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#D5AA61]/70 hover:text-[#D5AA61] transition-colors"
                >
                  <span>Next Legend</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
