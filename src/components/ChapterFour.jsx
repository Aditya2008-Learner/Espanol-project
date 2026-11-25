import React, { useRef, useState, useLayoutEffect } from 'react';
import { WordTitle } from './WordTitle';
import { StatValue } from './StatValue';
import { useChapterReveal } from '../motion/useChapterReveal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SIDES = {
  barcelona: {
    name: 'F.C. BARCELONA',
    image: '/assets/images/barcelona-stadium.webp',
    line: 'Més que un club — 1899',
    stats: [
      ['La Liga', 27],
      ['Champions League', 5],
      ['Copa del Rey', 31],
    ],
  },
  madrid: {
    name: 'REAL MADRID',
    image: '/assets/images/real-madrid-stadium.webp',
    line: 'Hala Madrid — 1902',
    stats: [
      ['La Liga', 36],
      ['Champions League', 15],
      ['Copa del Rey', 20],
    ],
  },
};

export const ChapterFour = () => {
  const sectionRef = useRef(null);
  const [focus, setFocus] = useState('both');
  useChapterReveal(sectionRef);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    const scrollerEl = document.querySelector('main');
    if (!root || !scrollerEl) return undefined;

    const ctx = gsap.context(() => {
      // Split wipe animation for the two articles
      gsap.fromTo(
        root.querySelectorAll('.clasico-card-barca'),
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 70%', once: true },
        }
      );
      gsap.fromTo(
        root.querySelectorAll('.clasico-card-madrid'),
        { clipPath: 'inset(0 0 0 100%)' },
        {
          clipPath: 'inset(0 0 0 0)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 70%', once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center bg-maroon bg-noise py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="chapter-label mb-6 inline-flex border border-gold/30 bg-burgundy/80 px-4 py-2 font-mono text-xs uppercase tracking-wide text-gold">
          Capítulo 04 — El Clásico
        </div>
        <WordTitle text="EL CLÁSICO" className="font-display text-5xl sm:text-7xl md:text-8xl leading-tight tracking-tight text-ivory" />

        <div className="mt-8 flex gap-3 font-mono text-xs uppercase tracking-widest">
          {['both', 'barcelona', 'madrid'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFocus(key)}
              className={`border px-4 py-2 transition-all duration-300 interactive-press ${focus === key ? 'border-gold bg-gold text-maroon font-bold' : 'border-ivory/20 text-ivory/70 hover:border-gold/50'}`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="relative mt-10 grid gap-6 lg:grid-cols-2">
          {Object.entries(SIDES).map(([key, side]) => (
            <article
              key={key}
              onMouseEnter={() => setFocus(key)}
              onMouseLeave={() => setFocus('both')}
              className={`relative aspect-[4/5] overflow-hidden border border-ivory/10 transition-all duration-500 hover:scale-[1.01] hover:border-gold/50 ${
                key === 'barcelona' ? 'clasico-card-barca' : 'clasico-card-madrid'
              } ${focus !== 'both' && focus !== key ? 'opacity-35 grayscale-[40%]' : 'opacity-100 shadow-2xl'}`}
            >
              <img
                src={side.image}
                alt={side.name}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
              <div className={`absolute inset-0 ${key === 'barcelona' ? 'bg-crimson/35' : 'bg-slate-900/40'}`} />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-5xl text-ivory">{side.name}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-gold">{side.line}</p>
                <dl className="mt-6 grid grid-cols-3 gap-3">
                  {side.stats.map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-ivory/60">{label}</dt>
                      <dd className="font-display text-3xl text-ivory"><StatValue value={value} /></dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-maroon font-display text-2xl text-gold lg:flex">
            VS
          </div>
        </div>
      </div>
    </section>
  );
};
