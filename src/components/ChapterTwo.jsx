import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { timelineData } from '../data/footballData';
import { WordTitle } from './WordTitle';
import { useChapterReveal } from '../motion/useChapterReveal';

export const ChapterTwo = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);

  const handleScroll = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, timelineData.length - 1)
      : Math.max(activeIndex - 1, 0);
    setActiveIndex(newIndex);
  };

  const activeItem = timelineData[activeIndex];

  return (
    <section ref={sectionRef} className="min-h-screen relative bg-maroon bg-noise flex flex-col">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Chapter Label */}
      <div className="relative z-10 px-6 pt-20 pb-8">
        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-burgundy/80 border border-gold/30 backdrop-blur-md chapter-label">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-gold">Capítulo 02 — Raíces</span>
        </div>
        <WordTitle text="THE ROOTS OF SPANISH FOOTBALL" className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-ivory" />
        <p className="font-serif italic text-lg text-ivory/60 mt-4 max-w-2xl section-title" style={{ opacity: 0.8 }}>
          From English miners in Huelva to world champions — an interactive journey through history
        </p>
      </div>

      {/* Timeline Track */}
      <div className="relative z-10 flex-1 flex items-center px-6 overflow-hidden">
        <div className="relative w-full h-1 bg-burgundy/50 flex items-center">
          {/* Progress line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 h-px bg-gradient-to-r from-crimson to-gold" style={{ width: `${(activeIndex / (timelineData.length - 1)) * 100}%` }} />
          
          {/* Timeline track with markers */}
          <div className="absolute inset-0 flex justify-between px-4" style={{ transform: 'translateY(-50%)' }}>
            {timelineData.map((item, index) => (
              <button
                key={item.year}
                onClick={() => setActiveIndex(index)}
                className={`relative flex flex-col items-center transition-all ${
                  index === activeIndex ? 'scale-110 z-10' : ''
                }`}
                style={{ position: 'relative', left: `${(index / (timelineData.length - 1)) * 100}%`, transform: 'translateX(-50%) translateY(50%)' }}
              >
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  index === activeIndex 
                    ? 'bg-crimson border-gold shadow-[0_0_24px_rgba(213,170,97,0.9)] scale-125' 
                    : 'bg-maroon border-burgundy hover:border-crimson/80 hover:scale-110'
                }`}>
                  {index === activeIndex && <div className="w-2 h-2 rounded-full bg-gold animate-ping" />}
                </div>
                <span className={`font-mono text-xs uppercase tracking-wider mt-2.5 transition-all duration-300 ${
                  index === activeIndex ? 'text-gold font-bold scale-110' : 'text-ivory/40 hover:text-ivory/70'
                }`}>
                  {item.year}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-6xl">
          <div className="relative grid lg:grid-cols-12 gap-8 items-start">
            {/* Image Panel */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-burgundy">
                <img 
                  src={activeItem.image}
                  alt={activeItem.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 opacity-90 hover:opacity-100 hover:scale-[1.02]"
                  style={{ filter: 'grayscale(20%) contrast(1.1)' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-burgundy', 'to-crimson');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-gold/80">{activeItem.category}</span>
                  <div className="font-display text-3xl md:text-4xl text-ivory mt-2">{activeItem.year}</div>
                </div>
              </div>
            </div>

            {/* Content Panel */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h3 className="font-display text-3xl md:text-4xl text-ivory leading-tight">
                  {activeItem.title}
                </h3>
                <div className="w-16 h-px bg-gradient-to-r from-crimson to-gold" />
                <p className="text-lg text-ivory/80 leading-relaxed font-serif">
                  {activeItem.description}
                </p>
              </div>

              <div className="bg-burgundy/50 border border-crimson/30 rounded-sm p-6 space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest text-gold">SIGNIFICANCE</h4>
                <p className="text-ivory/90">{activeItem.significance}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-burgundy/30">
                <button 
                  onClick={() => handleScroll('prev')}
                  disabled={activeIndex === 0}
                  className="group flex items-center space-x-2 text-ivory/60 hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-wider">Previous</span>
                </button>
                <div className="font-mono text-sm text-ivory/40">
                  {activeIndex + 1} / {timelineData.length}
                </div>
                <button 
                  onClick={() => handleScroll('next')}
                  disabled={activeIndex === timelineData.length - 1}
                  className="group flex items-center space-x-2 text-ivory/60 hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="font-mono text-xs uppercase tracking-wider">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative Spanish flag hint */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/30 via-gold/30 to-transparent" />
    </section>
  );
};