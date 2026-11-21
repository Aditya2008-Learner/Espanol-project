import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { clubsData } from '../data/footballData';
import { ChevronLeft, ChevronRight, MapPin, Trophy, Shield, Calendar, ArrowRight, X } from 'lucide-react';
import { WordTitle } from './WordTitle';
import { useReducedMotion } from '../motion/useReducedMotion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ChapterThree = () => {
  const [activeClub, setActiveClub] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  const activeClubData = clubsData[activeClub];

  // Fail-safe visibility & smooth GSAP reveal
  useLayoutEffect(() => {
    const root = sectionRef.current;
    const scrollerEl = document.querySelector('main');
    if (!root || !scrollerEl) return undefined;

    // Fail-safe: ensure cards and labels are never stuck at opacity 0
    gsap.set(root.querySelectorAll('.ch3-label, .ch3-title, .ch3-card, .ch3-nav'), {
      opacity: 1,
      y: 0,
      clearProps: 'filter'
    });

    if (reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('.ch3-label'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 80%', once: true }
        }
      );
      gsap.fromTo(
        root.querySelectorAll('.ch3-title'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 75%', once: true }
        }
      );
      gsap.fromTo(
        root.querySelectorAll('.ch3-card'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: 'top 70%', once: true }
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // Modal open & close with proper scroller locking
  const handleOpenModal = (index) => {
    setActiveClub(index);
    setIsOpen(true);
    const scroller = document.querySelector('main');
    if (scroller) scroller.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    const scroller = document.querySelector('main');
    if (scroller) scroller.style.overflow = 'auto';
  };

  // Keyboard navigation (Escape to close modal, Left/Right arrows for carousel)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        if (e.key === 'Escape') handleCloseModal();
      } else {
        if (e.key === 'ArrowLeft') {
          setActiveClub((prev) => (prev === 0 ? clubsData.length - 1 : prev - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveClub((prev) => (prev === clubsData.length - 1 ? 0 : prev + 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Calculate centered translation for active card
  // Card width = 280px + 28px gap = 308px step
  const cardStep = 308;
  const trackOffset = `calc(50% - ${activeClub * cardStep + 140}px)`;

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-maroon bg-noise flex flex-col justify-between py-16 overflow-hidden">
      {/* Decorative top ambient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Header Container */}
      <div className="relative z-10 px-6 sm:px-12 max-w-7xl mx-auto w-full pt-4">
        <div className="ch3-label inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-burgundy/80 border border-gold/30 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-gold">Capítulo 03 — Los Gigantes</span>
        </div>
        <WordTitle
          text="THE GIANTS OF SPAIN"
          className="ch3-title mt-4 font-display text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-ivory"
        />
        <p className="mt-3 font-serif italic text-base sm:text-lg text-ivory/70 max-w-2xl">
          Six monumental clubs whose distinct identities, regional cultures, and European triumphs define the soul of Spanish football.
        </p>
      </div>

      {/* Main Interactive Carousel Viewport */}
      <div className="relative z-10 w-full my-auto py-6">
        <div className="relative w-full overflow-hidden px-4">
          {/* Sliding Track */}
          <div
            ref={trackRef}
            className="flex items-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] py-6"
            style={{
              transform: `translateX(${trackOffset})`,
              width: `${clubsData.length * cardStep + 600}px`
            }}
          >
            {clubsData.map((club, index) => {
              const isActive = index === activeClub;
              return (
                <div
                  key={club.id}
                  onClick={() => {
                    if (isActive) {
                      handleOpenModal(index);
                    } else {
                      setActiveClub(index);
                    }
                  }}
                  className={`ch3-card cursor-pointer transition-all duration-500 mr-7 flex-shrink-0 select-none ${
                    isActive
                      ? 'scale-105 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(213,170,97,0.35)] ring-2 ring-gold'
                      : 'scale-95 opacity-55 hover:opacity-85 hover:scale-100'
                  }`}
                  style={{ width: '280px' }}
                >
                  <div className="relative h-[410px] rounded-sm overflow-hidden border border-gold/25 bg-burgundy flex flex-col justify-end group">
                    {/* Stadium Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={club.image}
                        alt={`${club.name} - ${club.stadium}`}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isActive ? 'scale-105' : 'group-hover:scale-105 grayscale-[30%]'
                        }`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#190A10] via-[#190A10]/60 to-transparent" />
                      <div className={`absolute inset-0 bg-gradient-to-b ${club.bgAccent} opacity-50 mix-blend-overlay`} />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 p-5 flex flex-col justify-end text-ivory">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-gold/90 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm border border-gold/20">
                          {club.city}
                        </span>
                        <div className="flex items-center space-x-1.5 font-mono text-[11px] text-ivory/60">
                          <Calendar className="w-3.5 h-3.5 text-gold/80" />
                          <span>{club.founded}</span>
                        </div>
                      </div>

                      <h3 className="font-display text-2xl tracking-wide leading-tight text-ivory mb-1">
                        {club.name}
                      </h3>

                      <p className="text-xs text-ivory/70 line-clamp-2 font-serif italic mb-3">
                        {club.identity}
                      </p>

                      <div className="pt-2 border-t border-ivory/15 flex items-center justify-between text-xs font-mono">
                        <span className="text-gold flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>{isActive ? 'Click to Explore' : 'Focus Club'}</span>
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 text-gold transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Navigation Controls */}
        <div className="ch3-nav max-w-5xl mx-auto px-6 flex items-center justify-between mt-4">
          <button
            type="button"
            aria-label="Previous club"
            onClick={() => setActiveClub((prev) => (prev === 0 ? clubsData.length - 1 : prev - 1))}
            className="w-11 h-11 rounded-full bg-maroon/90 border border-gold/40 flex items-center justify-center text-gold hover:bg-crimson hover:text-ivory transition-all duration-300 shadow-xl active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Active Club Indicator Pills */}
          <div className="flex items-center space-x-2">
            {clubsData.map((club, index) => (
              <button
                key={club.id}
                type="button"
                aria-label={`Select ${club.name}`}
                onClick={() => setActiveClub(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeClub
                    ? 'w-8 h-2.5 bg-gradient-to-r from-crimson to-gold shadow-[0_0_12px_rgba(213,170,97,0.7)]'
                    : 'w-2.5 h-2.5 bg-burgundy/60 hover:bg-gold/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next club"
            onClick={() => setActiveClub((prev) => (prev === clubsData.length - 1 ? 0 : prev + 1))}
            className="w-11 h-11 rounded-full bg-maroon/90 border border-gold/40 flex items-center justify-center text-gold hover:bg-crimson hover:text-ivory transition-all duration-300 shadow-xl active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center pb-2">
        <p className="font-mono text-xs uppercase tracking-widest text-gold/70">
          Showing <span className="text-ivory font-bold">{activeClub + 1}</span> of {clubsData.length}:{' '}
          <span className="text-gold font-bold">{activeClubData.name}</span> — {activeClubData.stadium}
        </p>
      </div>

      {/* Modal Detail Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="club-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="relative bg-[#190A10] border border-gold/30 rounded-sm max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              type="button"
              aria-label="Close dialog"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-maroon/90 border border-gold/40 flex items-center justify-center text-ivory hover:bg-crimson hover:text-white transition-all shadow-lg active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Side */}
            <div className="relative h-64 md:h-auto md:w-5/12 flex-shrink-0 overflow-hidden bg-burgundy">
              <img
                src={activeClubData.image}
                alt={activeClubData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#190A10] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#190A10]" />
              <div className="absolute bottom-4 left-4 right-4 p-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gold/90">Official Stadium</p>
                <p className="font-sans text-xs text-ivory/80 font-medium">{activeClubData.stadium}</p>
              </div>
            </div>

            {/* Modal Content Side */}
            <div className="p-6 sm:p-8 md:p-10 flex-1 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-gold font-mono text-xs uppercase tracking-widest mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{activeClubData.city} · Founded {activeClubData.founded}</span>
                </div>
                <h3 id="club-modal-title" className="font-display text-3xl sm:text-4xl text-ivory tracking-wide leading-tight">
                  {activeClubData.name}
                </h3>
              </div>

              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-gold flex items-center gap-1.5 mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Playing Identity & Philosophy</span>
                </h4>
                <p className="text-ivory/85 font-serif text-sm sm:text-base leading-relaxed">
                  {activeClubData.identity}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-gold flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Club History & Heritage</span>
                </h4>
                <p className="text-ivory/80 font-serif text-sm sm:text-base leading-relaxed">
                  {activeClubData.history}
                </p>
              </div>

              <div className="bg-burgundy/40 border border-crimson/25 p-4 rounded-sm">
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-gold flex items-center gap-1.5 mb-1.5">
                  <Trophy className="w-3.5 h-3.5 text-gold" />
                  <span>Major Honours</span>
                </h4>
                <p className="text-ivory font-serif text-sm sm:text-base font-medium">
                  {activeClubData.trophies}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2.5">
                  Iconic Figures & Legends
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeClubData.legendaryPlayers.map((player, idx) => (
                    <span
                      key={idx}
                      className="bg-maroon border border-gold/25 px-3 py-1 rounded-full text-xs font-mono text-ivory/90"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};
