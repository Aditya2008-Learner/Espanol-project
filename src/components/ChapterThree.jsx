import React, { useState, useRef } from 'react';
import { clubsData } from '../data/footballData';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { WordTitle } from './WordTitle';
import { useChapterReveal } from '../motion/useChapterReveal';

export const ChapterThree = () => {
  const [activeClub, setActiveClub] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);

  const handleClubClick = (index) => {
    setActiveClub(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const activeClubData = clubsData[activeClub];

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-maroon flex flex-col">
      {/* Chapter Label */}
      <div className="relative z-10 px-6 pt-20 pb-8">
        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-burgundy/80 border border-gold/30 backdrop-blur-md chapter-label">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-ping"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-gold">Capítulo 03 — Los Gigantes</span>
        </div>
        <WordTitle text="THE GIANTS OF SPAIN" className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-ivory" />
        <p className="font-serif italic text-lg text-ivory/60 mt-4 max-w-2xl section-title" style={{ opacity: 0.8 }}>
          Six legendary clubs who define the soul of Spanish football
        </p>
      </div>

      {/* Club Carousel */}
      <div className="relative z-10 flex-1 px-6 pb-24">
        <div className="w-full max-w-6xl mx-auto">
          <div className="relative flex items-center justify-center">
            {/* Navigation Arrows */}
            <button 
              onClick={() => {
                const newIndex = activeClub === 0 ? clubsData.length - 1 : activeClub - 1;
                setActiveClub(newIndex);
              }}
              className="absolute left-0 md:left-10 z-20 w-12 h-12 rounded-full bg-maroon border-2 border-gold/30 flex items-center justify-center text-gold hover:bg-crimson transition-all duration-300 shadow-2xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-hidden">
              <div className="labs-container flex gap-8 px-16 md:px-32 justify-center items-stretch">
                {clubsData.map((club, index) => (
                  <div
                    key={club.id}
                    className={`club-card reveal-block cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_16px_36px_rgba(213,170,97,0.3)] ${
                      index === activeClub ? 'scale-100 ring-2 ring-gold/60 shadow-2xl' : 'opacity-40 grayscale hover:opacity-90 hover:grayscale-0'
                    }`}
                    onClick={() => handleClubClick(index)}
                  >
                    <div className="relative w-64 h-[400px] rounded-sm overflow-hidden border-2 transition-all duration-300">
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={club.image} 
                          alt={club.name} 
                          loading="lazy"
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent" />
                      </div>
                      <div className="relative z-10 flex flex-col justify-end p-4 text-white">
                        <h3 className="font-display text-xl leading-tight">{club.name}</h3>
                        <p className="font-mono text-xs uppercase tracking-widest text-gold/80">{club.city}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-2 h-2 rounded-full bg-crimson" />
                          <span className="font-mono text-xs">{club.founded}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                const newIndex = activeClub === clubsData.length - 1 ? 0 : activeClub + 1;
                setActiveClub(newIndex);
              }}
              className="absolute right-0 md:right-10 z-20 w-12 h-12 rounded-full bg-maroon border-2 border-gold/30 flex items-center justify-center text-gold hover:bg-crimson transition-all duration-300 shadow-2xl"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Active Club Indicator */}
          <div className="flex justify-center items-center space-x-3 mt-6">
            {clubsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveClub(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeClub ? 'bg-crimson scale-125 shadow-[0_0_15px_rgba(213,170,97,0.6)]' : 'bg-burgundy/40 hover:bg-crimson'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="relative bg-maroon rounded-sm max-w-4xl w-[90%] mx-6 overflow-hidden shadow-2xl border border-crimson/30">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-maroon border border-gold/30 flex items-center justify-center text-ivory hover:bg-crimson transition-all"
            >
              ✕
            </button>

            <div className="grid lg:grid-cols-2">
              {/* Image Side */}
              <div className="relative h-80 md:h-full">
                <img 
                  src={activeClubData.image} 
                  alt={activeClubData.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent" />
              </div>

              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6 overflow-y-auto max-h-96">
                <div>
                  <h3 className="font-display text-4xl text-ivory leading-tight">{activeClubData.name}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="font-mono text-sm text-ivory/70">{activeClubData.city}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-2">PLAYING IDENTITY</h4>
                  <p className="text-ivory/90 font-serif">{activeClubData.identity}</p>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-2">CLUB HISTORY</h4>
                  <p className="text-ivory/90 font-serif">{activeClubData.history}</p>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-3">MAJOR ACHIEVEMENTS</h4>
                  <p className="text-ivory/90 font-serif">{activeClubData.trophies}</p>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-3">LEGENDARY PLAYERS</h4>
                  <ul className="flex flex-wrap gap-2">
                    {activeClubData.legendaryPlayers.map((player, idx) => (
                      <li key={idx} className="bg-burgundy/30 px-3 py-1 rounded-full text-sm text-ivory border border-gold/20">
                        {player}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
};