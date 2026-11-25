import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scroller = document.querySelector('main');
    if (!scroller) return undefined;
    const handleScroll = () => setScrolled(scroller.scrollTop > 50);
    scroller.addEventListener('scroll', handleScroll);
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  const chapters = [
    { id: 'chapter-1', label: 'Inicio' },
    { id: 'chapter-2', label: 'Raíces' },
    { id: 'chapter-3', label: 'Gigantes' },
    { id: 'chapter-4', label: 'Clásico' },
    { id: 'chapter-5', label: 'Generación' },
    { id: 'chapter-6', label: 'Tiki-Taka' },
    { id: 'chapter-7', label: 'Leyendas' },
    { id: 'chapter-8', label: 'Modernidad' },
    { id: 'chapter-9', label: 'Quiz' },
    { id: 'chapter-10', label: 'Final' },
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-maroon/95 backdrop-blur-md py-3 shadow-lg border-b border-gold/20' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-crimson rounded-full flex items-center justify-center font-display text-ivory text-xl font-bold group-hover:scale-110 transition-transform">FS</div>
          <span className="font-display text-2xl tracking-tight leading-normal text-ivory hidden sm:block">FÚTBOL <span className="text-gold">ESPAÑOL</span></span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {chapters.map((chapter) => (
            <a 
              key={chapter.id} 
              href={`#${chapter.id}`} 
              onClick={(e) => handleNavClick(e, chapter.id)}
              className="text-xs font-mono uppercase tracking-widest text-ivory/60 hover:text-gold transition-colors relative py-1 group"
            >
              {chapter.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-ivory" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-maroon border-b border-gold/20 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen py-8' : 'max-h-0'}`}>
        <div className="flex flex-col items-center gap-6 px-6">
          {chapters.map((chapter) => (
            <a 
              key={chapter.id} 
              href={`#${chapter.id}`} 
              onClick={(e) => handleNavClick(e, chapter.id)}
              className="text-lg font-display tracking-wider text-ivory hover:text-gold transition-colors"
            >
              {chapter.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};
