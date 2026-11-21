import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { modernEraData } from '../data/footballData';
import { useReducedMotion } from '../motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const COACHES = [
  { name: 'Pep Guardiola', role: 'Manchester City', detail: 'The most decorated active manager. Pioneer of positional play, juego de posición, and high-pressing intensity across Barcelona, Bayern Munich, and Manchester City.' },
  { name: 'Luis Enrique', role: 'Former Spain & Paris Saint-Germain', detail: 'Bold tactical risk-taker who modernised La Roja with high-energy pressing, fast transitions, and youth integration of Pedri and Gavi.' },
  { name: 'Xabi Alonso', role: 'Bayer Leverkusen', detail: 'Led Leverkusen to an unbeaten Bundesliga title and Europa League final in his debut full season, combining possession control with devastating counter-attacks.' },
  { name: 'Mikel Arteta', role: 'Arsenal', detail: 'Transformed Arsenal into genuine Premier League title contenders through structured positional play, inverted full-backs, and relentless standards. A Guardiola protégé forging his own identity.' },
  { name: 'Luis de la Fuente', role: 'Spain National Team', detail: 'Guided Spain to a dominant Euro 2024 victory with a fearless blend of youth (Yamal, Williams) and tactical flexibility, winning every match en route to the title.' },
];

const TALENTS = [
  { name: 'Lamine Yamal', age: '17', club: 'FC Barcelona', highlight: 'Euro 2024 champion and youngest-ever scorer in European Championship history. Devastating dribbler and creator.' },
  { name: 'Pedri', age: '21', club: 'FC Barcelona', highlight: 'Midfield metronome inheriting Iniesta\'s mantle. Euro 2020 Young Player of the Tournament and integral to La Roja\'s engine room.' },
  { name: 'Gavi', age: '20', club: 'FC Barcelona', highlight: 'Youngest Spanish international since 1936. Relentless pressing, fearless tackling, and extraordinary maturity for his age.' },
  { name: 'Nico Williams', age: '22', club: 'Athletic Club', highlight: 'Explosive left winger who terrorised defences at Euro 2024. Two-footed, rapid, and decisive in the final.' },
  { name: 'Pau Cubarsí', age: '17', club: 'FC Barcelona', highlight: 'Commanding centre-back who debuted in the Champions League knockout rounds as a 16-year-old, reading the game beyond his years.' },
];

export const ChapterEight = () => {
  const sectionRef = useRef(null);
  const [tab, setTab] = useState('talent');
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = sectionRef.current;
    const scrollerEl = document.querySelector('main');
    if (!root || !scrollerEl) return undefined;

    /* Fail-safe: always start visible */
    gsap.set(root.querySelectorAll('.mod-label, .mod-heading, .mod-card, .mod-panel, .mod-tabs'), {
      opacity: 1, y: 0,
    });

    if (reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('.mod-label'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 80%', once: true } }
      );
      gsap.fromTo(
        root.querySelectorAll('.mod-heading'),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 78%', once: true } }
      );
      gsap.fromTo(
        root.querySelectorAll('.mod-card'),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 70%', once: true } }
      );
      gsap.fromTo(
        root.querySelectorAll('.mod-panel'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 62%', once: true } }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const list = tab === 'talent' ? TALENTS : COACHES;

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#190A10] bg-noise py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Label */}
        <div className="mod-label mb-4 inline-flex items-center gap-3 border border-[#D5AA61]/30 bg-[#350D19]/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#D5AA61]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#B51F35]" />
          Capítulo 08 — Modernidad
        </div>
        <h2 className="mod-heading font-display text-4xl sm:text-6xl md:text-8xl leading-tight tracking-tight text-[#F4EFE5] py-1">
          MODERN SPANISH <span className="text-[#D5AA61]">FOOTBALL</span>
        </h2>
        <p className="mt-4 max-w-2xl font-serif text-lg italic text-[#F4EFE5]/60">
          {modernEraData.overview}
        </p>

        {/* Four pillars */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modernEraData.pillars.map((pillar, i) => (
            <div key={i} className="mod-card space-y-3 border border-[#B51F35]/20 bg-[#350D19]/40 p-7 transition-all hover:-translate-y-1 hover:border-[#D5AA61]/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D5AA61]">{pillar.stat}</p>
              <h3 className="font-display text-2xl text-[#F4EFE5]">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-[#F4EFE5]/60">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="mod-tabs mt-20 flex gap-3 font-mono text-xs uppercase tracking-widest">
          {['talent', 'coaches'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`border px-5 py-2.5 transition-colors ${
                tab === key
                  ? 'border-[#D5AA61] bg-[#D5AA61] text-[#190A10]'
                  : 'border-[#F4EFE5]/20 text-[#F4EFE5]/70 hover:border-[#D5AA61]/50'
              }`}
            >
              {key === 'talent' ? 'New Generation' : 'Spanish Coaches'}
            </button>
          ))}
        </div>

        {/* Panel list */}
        <div className="mod-panel mt-8 divide-y divide-[#350D19]">
          {list.map((item, i) => (
            <div key={item.name} className="grid gap-6 py-7 md:grid-cols-12">
              <div className="flex items-baseline gap-4 md:col-span-4">
                <span className="font-mono text-xs text-[#D5AA61]/50">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="font-display text-2xl text-[#F4EFE5]">{item.name}</h4>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#D5AA61]/70">
                    {tab === 'talent' ? `${item.club} · ${item.age}` : item.role}
                  </p>
                </div>
              </div>
              <p className="font-serif text-base leading-relaxed text-[#F4EFE5]/75 md:col-span-8">
                {tab === 'talent' ? item.highlight : item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
