import { useEffect, useState } from 'react';

const CHAPTERS = [
  ['chapter-1', '01'],
  ['chapter-2', '02'],
  ['chapter-3', '03'],
  ['chapter-4', '04'],
  ['chapter-5', '05'],
  ['chapter-6', '06'],
  ['chapter-7', '07'],
  ['chapter-8', '08'],
  ['chapter-9', '09'],
  ['chapter-10', '10'],
];

export function ChapterRail() {
  const [active, setActive] = useState('chapter-1');

  useEffect(() => {
    const nodes = CHAPTERS.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return undefined;

    const scroller = document.querySelector('main');
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: scroller, threshold: [0.35, 0.55, 0.75] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Chapter progress" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex">
      {CHAPTERS.map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          className={`font-mono text-[10px] tracking-widest transition-colors ${active === id ? 'text-gold' : 'text-ivory/35 hover:text-ivory/70'}`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
