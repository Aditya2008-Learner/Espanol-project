import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../motion/useReducedMotion';
import { splitGraphemes } from '../utils/text';

const TITLE = 'FÚTBOL ESPAÑOL';

export const ChapterOne = () => {
  const heroRef = useRef(null);
  const buttonRef = useRef(null);
  const reduced = useReducedMotion();
  const [introDone, setIntroDone] = useState(reduced);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return undefined;

    if (reduced) {
      gsap.set(root.querySelectorAll('.intro-char, .intro-sub, .intro-cta, .intro-veil, .light-sweep'), {
        opacity: 1,
        y: 0,
        filter: 'none',
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => setIntroDone(true),
      });

      timeline
        .fromTo('.stadium-plate', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' })
        .from('.intro-char', { yPercent: 120, opacity: 0, duration: 0.85, stagger: 0.035, ease: 'power4.out' }, 0.45)
        .to('.intro-char', { filter: 'brightness(1.3)', duration: 0.2, stagger: 0.035, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.45)
        .fromTo('.light-sweep', { xPercent: -130, opacity: 0 }, { xPercent: 130, opacity: 0.7, duration: 0.9, ease: 'power2.inOut' }, 1.05)
        .from('.intro-sub', { y: 24, opacity: 0, filter: 'blur(8px)', duration: 0.8, ease: 'power3.out' }, 1.15)
        .from('.intro-cta', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1.45);

      // Ken Burns slow scale on scroll scrub
      gsap.to('.stadium-plate img', {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          scroller: document.querySelector('main'),
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || reduced) return undefined;

    const onMove = (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      gsap.to(button, { x: x * 0.18, y: y * 0.18, duration: 0.35, ease: 'power3.out' });
    };
    const reset = () => gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: 'power3.out' });

    button.addEventListener('mousemove', onMove);
    button.addEventListener('mouseleave', reset);
    return () => {
      button.removeEventListener('mousemove', onMove);
      button.removeEventListener('mouseleave', reset);
    };
  }, [reduced]);

  const skipIntro = () => {
    const root = heroRef.current;
    if (!root) return;
    gsap.killTweensOf(root.querySelectorAll('.intro-char, .intro-sub, .intro-cta, .stadium-plate, .light-sweep'));
    gsap.set(root.querySelectorAll('.intro-char, .intro-sub, .intro-cta, .stadium-plate'), { opacity: 1, y: 0, yPercent: 0, scale: 1, filter: 'none' });
    setIntroDone(true);
  };

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden bg-black bg-noise">
      <div className="stadium-plate absolute inset-0">
        <img
          src="/assets/images/spain-2010-team-trophy.jpg"
          alt="Spain national football team celebrating 2010 World Cup victory with trophy"
          fetchpriority="high"
          className="h-full w-full object-cover object-center opacity-85 scale-100"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#190A10] via-[#190A10]/40 to-black/50" />
      </div>

      {/* Subtle directional light washes - no radial blobs */}
      <div className="floodlight pointer-events-none absolute -left-16 top-10 h-80 w-48 rotate-12 bg-gold/15 blur-3xl" />
      <div className="floodlight pointer-events-none absolute -right-10 top-20 h-72 w-44 -rotate-12 bg-crimson/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-40">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-ivory/50"
            style={{ left: `${(index * 17) % 100}%`, top: `${(index * 29) % 100}%` }}
          />
        ))}
      </div>

      {!introDone && (
        <button
          type="button"
          onClick={skipIntro}
          className="absolute right-6 top-24 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/60 hover:text-gold"
        >
          Skip intro
        </button>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="intro-cta mb-6 font-mono text-xs uppercase tracking-[0.35em] text-gold">Capítulo 01 — El Legado</p>
        <h1 className="relative font-display text-5xl leading-tight tracking-tight text-ivory sm:text-7xl md:text-8xl lg:text-[8.5rem]">
          <span className="relative inline-block overflow-hidden py-3 -my-3 px-1">
            {splitGraphemes(TITLE).map((char, index) => (
              <span key={`${char}-${index}`} className="intro-char inline-block py-1">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <span className="light-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ivory/70 to-transparent" />
          </span>
        </h1>
        <p className="intro-sub mt-6 max-w-2xl font-serif text-xl italic text-ivory/80 md:text-2xl">
          A legacy written in passion, precision, and global supremacy.
        </p>
        <a
          ref={buttonRef}
          href="#chapter-2"
          className="intro-cta interactive-press mt-10 inline-flex items-center gap-3 bg-crimson px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-gold hover:text-maroon"
        >
          Enter the experience
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
