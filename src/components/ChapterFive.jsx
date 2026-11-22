import React, { useRef } from 'react';
import { WordTitle } from './WordTitle';
import { useChapterReveal } from '../motion/useChapterReveal';

const MOMENTS = [
  { year: '2008', title: 'Euro 2008', detail: 'Austria and Switzerland. Fernando Torres finishes the final. Spain\'s first major trophy of the era.' },
  { year: '2010', title: 'World Cup 2010', detail: 'Johannesburg. Iniesta in the 116th minute. The night Spanish football became the centre of the sport.' },
  { year: '2012', title: 'Euro 2012', detail: 'A 4–0 final in Kyiv. The only side to hold the Euros, the World Cup, and the Euros again.' },
];

// Scoreline strip connecting the three trophies — only shown when scroll reveals
const SCORELINES = [
  { match: 'ESP 1–0 GER · Wien 2008', accent: 'gold' },
  { match: 'ESP 1–0 NED · Johannesburg 2010', accent: 'gold' },
  { match: 'ESP 4–0 ITA · Kyiv 2012', accent: 'gold' },
];

export const ChapterFive = () => {
  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center bg-maroon bg-noise py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="chapter-label mb-6 inline-flex border border-gold/30 bg-burgundy/80 px-4 py-2 font-mono text-xs uppercase tracking-wide text-gold">
          Capítulo 05 — La Generación Dorada
        </div>
        <WordTitle text="THE GOLDEN GENERATION" className="font-display text-4xl sm:text-6xl md:text-8xl leading-tight tracking-tight text-ivory" />

        {/* Scoreline strip — documentary style bridge between trophies */}
        <div className="reveal-block mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="hidden sm:block h-px w-12 bg-gold" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 font-display text-sm sm:text-base">
              {SCORELINES.map((s, i) => (
                <span key={i} className="text-ivory">
                  <span className={`text-${s.accent === 'gold' ? 'gold' : 'ivory'}`}>
                    {s.match}
                  </span>
                </span>
              ))}
            </div>
            <div className="hidden sm:block h-px w-12 bg-gold" />
          </div>
        </div>

        <div className="mt-12 flex snap-x gap-6 overflow-x-auto pb-6">
          {MOMENTS.map((moment) => (
            <article
              key={moment.year}
              className={`reveal-block min-w-[78%] snap-center border p-8 md:min-w-[32%] ${moment.year === '2010' ? 'border-gold bg-burgundy/70 shadow-md' : 'border-crimson/20 bg-burgundy/40'}`}
            >
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-gold">{moment.year}</p>
              <h3 className="mt-4 font-display text-4xl text-ivory">{moment.title}</h3>
              <p className="mt-4 font-serif text-lg leading-relaxed text-ivory/75">{moment.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};