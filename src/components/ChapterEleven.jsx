import React, { useRef } from 'react';
import { WordTitle } from './WordTitle';
import { useChapterReveal } from '../motion/useChapterReveal';
import { sourcesRegistry } from '../data/sources';
import { ExternalLink, BookOpen, Camera, Trophy, MessageSquare } from 'lucide-react';

export const ChapterEleven = () => {
  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#190A10] bg-noise py-24 text-ivory">
      <div className="mx-auto w-full max-w-7xl px-6">
        
        {/* Chapter Header */}
        <div className="chapter-label mb-4 inline-flex items-center gap-2 border border-gold/30 bg-burgundy/80 px-4 py-2 font-mono text-xs uppercase tracking-wide text-gold">
          <span className="h-2 w-2 rounded-full bg-crimson" />
          Capítulo 11 — Fuentes y Créditos
        </div>
        <WordTitle text="SOURCES & CREDITS" className="font-display text-4xl sm:text-6xl md:text-8xl leading-tight tracking-tight text-ivory py-1" />
        <p className="mt-4 max-w-2xl font-serif text-lg text-ivory/70">
          An educational documentary built upon verified historical archives, open licenses, primary statistical records, and academic football scholarship.
        </p>

        {/* 1. Image Credits */}
        <div className="mt-16 space-y-8">
          <div className="flex items-center gap-3 border-b border-burgundy pb-4">
            <Camera className="w-6 h-6 text-gold" />
            <h3 className="font-display text-2xl sm:text-3xl text-ivory tracking-wide">1. Image Credits & Archive Attribution</h3>
          </div>
          <p className="font-serif text-sm text-ivory/60">
            All visual assets are stored locally and sourced from verified open-access archives under Creative Commons or editorial licensing terms.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {sourcesRegistry.images.map((img) => (
              <div key={img.id} className="border border-burgundy bg-burgundy/40 p-5 rounded-sm space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-display text-lg text-ivory">{img.title}</h4>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gold bg-maroon px-2 py-0.5 rounded border border-gold/20">
                    {img.license}
                  </span>
                </div>
                <p className="font-mono text-xs text-ivory/70">
                  Creator: <span className="text-ivory font-medium">{img.creator}</span> ({img.source})
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-burgundy/60 text-xs font-mono text-ivory/50">
                  <span>{img.chapter}</span>
                  <a 
                    href={img.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:underline"
                  >
                    Source Archive <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Historical & Factual References */}
        <div className="mt-20 space-y-8">
          <div className="flex items-center gap-3 border-b border-burgundy pb-4">
            <BookOpen className="w-6 h-6 text-gold" />
            <h3 className="font-display text-2xl sm:text-3xl text-ivory tracking-wide">2. Historical & Factual References</h3>
          </div>
          <div className="divide-y divide-burgundy border-y border-burgundy bg-burgundy/20">
            {sourcesRegistry.historicalReferences.map((ref) => (
              <div key={ref.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gold">{ref.chapter}</span>
                  <h4 className="font-display text-xl text-ivory">{ref.title}</h4>
                  <p className="font-serif text-sm text-ivory/70">{ref.organization} ({ref.date})</p>
                </div>
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-gold hover:text-ivory transition-colors whitespace-nowrap bg-maroon px-4 py-2 rounded-sm border border-gold/30"
                >
                  Verify Record <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Statistics & Records */}
        <div className="mt-20 space-y-8">
          <div className="flex items-center gap-3 border-b border-burgundy pb-4">
            <Trophy className="w-6 h-6 text-gold" />
            <h3 className="font-display text-2xl sm:text-3xl text-ivory tracking-wide">3. Statistics & Authoritative Records</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {sourcesRegistry.statistics.map((stat) => (
              <div key={stat.id} className="border border-burgundy bg-burgundy/40 p-6 rounded-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="font-display text-xl text-gold">{stat.item}</h4>
                  <p className="font-serif text-sm text-ivory/90 font-medium">{stat.value}</p>
                </div>
                <div className="pt-3 border-t border-burgundy/60 flex items-center justify-between font-mono text-[11px] text-ivory/60">
                  <span>{stat.source}</span>
                  <a href={stat.url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline inline-flex items-center gap-1">
                    Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Quotations */}
        <div className="mt-20 space-y-8 pb-16">
          <div className="flex items-center gap-3 border-b border-burgundy pb-4">
            <MessageSquare className="w-6 h-6 text-gold" />
            <h3 className="font-display text-2xl sm:text-3xl text-ivory tracking-wide">4. Verified Quotations & Attributions</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {sourcesRegistry.quotations.map((q, idx) => (
              <blockquote key={idx} className="border-l-2 border-crimson bg-burgundy/30 p-6 rounded-r-sm space-y-4">
                <p className="font-serif italic text-base text-ivory/90 leading-relaxed">
                  "{q.quote}"
                </p>
                <footer className="flex items-center justify-between pt-2 border-t border-burgundy/60 font-mono text-xs text-gold">
                  <span>— {q.speaker}</span>
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-ivory/70 hover:text-gold transition-colors inline-flex items-center gap-1">
                    {q.source} <ExternalLink className="w-3 h-3" />
                  </a>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-12 border-t border-burgundy text-center font-mono text-xs text-ivory/40">
          FÚTBOL ESPAÑOL — The Immersive Documentary · Educational Non-Commercial Project
        </div>

      </div>
    </section>
  );
};
