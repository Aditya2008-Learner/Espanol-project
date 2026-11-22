import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tacticalPositions } from '../data/footballData';
import { WordTitle } from './WordTitle';
import { useChapterReveal } from '../motion/useChapterReveal';
import { useReducedMotion } from '../motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const ROUTES = [
  ['gk', 'cb'],
  ['cb', 'dm'],
  ['dm', 'cm'],
  ['cm', 'wg'],
  ['wg', 'st'],
];

export const ChapterSix = () => {
  const sectionRef = useRef(null);
  const ballRef = useRef(null);
  const reduced = useReducedMotion();
  const [selectedId, setSelectedId] = useState('dm');
  const [playing, setPlaying] = useState(false);
  useChapterReveal(sectionRef);

  const selected = tacticalPositions.find((position) => position.id === selectedId) || tacticalPositions[3];
  const links = useMemo(() => {
    const byId = Object.fromEntries(tacticalPositions.map((position) => [position.id, position]));
    return ROUTES
      .filter(([from]) => from === selectedId || selectedId === 'dm')
      .map(([from, to]) => ({ from: byId[from], to: byId[to] }))
      .filter((link) => link.from && link.to);
  }, [selectedId]);

  // Subtle chalk-like drawing animation on passing routes on entry
  useLayoutEffect(() => {
    const root = sectionRef.current;
    const scrollerEl = document.querySelector('main');
    if (!root || !scrollerEl || reduced) return undefined;

    const ctx = gsap.context(() => {
      const routes = root.querySelectorAll('.tactical-route');
      if (routes.length > 0) {
        gsap.fromTo(
          routes,
          { strokeDashoffset: 40, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root,
              scroller: scrollerEl,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced, links]);

  const replay = () => {
    const ball = ballRef.current;
    if (!ball || reduced) return;
    const sequence = ROUTES
      .map(([from, to]) => {
        const start = tacticalPositions.find((position) => position.id === from);
        const end = tacticalPositions.find((position) => position.id === to);
        return start && end ? { start, end } : null;
      })
      .filter(Boolean);

    setPlaying(true);
    const timeline = gsap.timeline({ onComplete: () => setPlaying(false) });
    sequence.forEach(({ start, end }, index) => {
      timeline.set(ball, { attr: { cx: start.coordinates.x, cy: start.coordinates.y } }, index === 0 ? 0 : '>');
      timeline.to(ball, {
        attr: { cx: end.coordinates.x, cy: end.coordinates.y },
        duration: 0.55,
        ease: 'power2.inOut',
      });
    });
  };

  useEffect(() => () => gsap.killTweensOf(ballRef.current), []);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen flex-col justify-center bg-maroon bg-noise py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="chapter-label mb-6 inline-flex items-center gap-3 border border-gold/30 bg-burgundy/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gold">
          Capítulo 06 — La Táctica
        </div>
        <WordTitle text="THE ART OF TIKI-TAKA" className="font-display text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-ivory" />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-12">
          <div className="reveal-block relative rounded-sm border border-emerald-700/40 bg-[#163226] p-6 lg:col-span-7">
            <svg viewBox="0 0 100 100" className="mx-auto aspect-[4/5] w-full max-w-xl overflow-visible">
              <defs>
                <marker
                  id="tactical-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#D5AA61" />
                </marker>
              </defs>

              {/* Pitch markings */}
              <rect x="6" y="6" width="88" height="88" fill="none" stroke="#F4EFE5" strokeOpacity="0.35" />
              <line x1="6" y1="50" x2="94" y2="50" stroke="#F4EFE5" strokeOpacity="0.35" />
              <circle cx="50" cy="50" r="11" fill="none" stroke="#F4EFE5" strokeOpacity="0.35" />

              {/* Animated tactical passing lanes with arrowheads */}
              {links.map((link) => (
                <line
                  key={`${link.from.id}-${link.to.id}`}
                  className="tactical-route"
                  x1={link.from.coordinates.x}
                  y1={link.from.coordinates.y}
                  x2={link.to.coordinates.x}
                  y2={link.to.coordinates.y}
                  stroke="#D5AA61"
                  strokeWidth="0.8"
                  strokeDasharray="3 1.5"
                  markerEnd="url(#tactical-arrow)"
                />
              ))}

              {tacticalPositions.map((position) => {
                const active = position.id === selectedId;
                return (
                  <g 
                    key={position.id} 
                    className="cursor-pointer transition-transform duration-300 hover:scale-125" 
                    onClick={() => {
                      setSelectedId(position.id);
                      if (!playing && !reduced) {
                        const ball = ballRef.current;
                        if (ball) {
                          gsap.to(ball, {
                            attr: { cx: position.coordinates.x, cy: position.coordinates.y },
                            duration: 0.45,
                            ease: 'power2.out'
                          });
                        }
                      }
                    }}
                  >
                    <circle
                      cx={position.coordinates.x}
                      cy={position.coordinates.y}
                      r={active ? 4.4 : 3.1}
                      fill={active ? '#D5AA61' : '#B51F35'}
                      stroke="#F4EFE5"
                    />
                    <text x={position.coordinates.x} y={position.coordinates.y + 7} textAnchor="middle" className="fill-ivory font-mono text-[3px]">
                      {position.id.toUpperCase()}
                    </text>
                  </g>
                );
              })}
              <circle ref={ballRef} cx="50" cy="50" r="1.6" fill="#F4EFE5" />
            </svg>
            <button
              type="button"
              onClick={replay}
              disabled={playing}
              className="mt-4 font-mono text-xs uppercase tracking-widest text-gold disabled:opacity-40"
            >
              Replay sequence
            </button>
          </div>

          <div className="reveal-block space-y-4 border border-crimson/20 bg-burgundy/50 p-8 lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Possession 68%</p>
            <h3 className="font-display text-4xl text-ivory">{selected.name}</h3>
            <p className="font-mono text-sm uppercase tracking-widest text-gold/80">{selected.role}</p>
            <p className="font-serif text-lg leading-relaxed text-ivory/80">{selected.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
