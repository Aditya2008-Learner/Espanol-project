import React from 'react';
import { normalizeSpanish } from '../utils/text';

export function WordTitle({ text, className = '' }) {
  const normalized = normalizeSpanish(text);
  const words = normalized.trim().split(/\s+/);

  return (
    <h2 className={`section-title ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom py-3 -my-3 px-0.5 mr-[0.22em] last:mr-0"
        >
          <span className="word-reveal inline-block py-0.5">{word}</span>
        </span>
      ))}
    </h2>
  );
}
