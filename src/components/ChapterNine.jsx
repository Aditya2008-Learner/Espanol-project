import React, { useState, useRef } from 'react';
import { quizQuestions } from '../data/footballData';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { WordTitle } from './WordTitle';
import { useChapterReveal } from '../motion/useChapterReveal';

export const ChapterNine = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === quizQuestions[currentIdx].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  const question = quizQuestions[currentIdx];

  return (
    <section ref={sectionRef} className="min-h-screen relative bg-maroon flex items-center justify-center bg-noise py-20">
      <div className="w-full max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-burgundy/80 border border-gold/30 backdrop-blur-md chapter-label">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-gold">Capítulo 09 — El Cuestionario</span>
        </div>
        <WordTitle text="TEST YOUR KNOWLEDGE" className="mt-6 font-display text-5xl tracking-tighter text-ivory md:text-8xl" />

        {!showResult ? (
          <div className="mt-12 bg-burgundy/40 border border-crimson/20 rounded-sm p-8 space-y-6">
            <div className="h-1 bg-maroon">
              <div className="h-full bg-gold transition-all duration-500" style={{ width: `${((currentIdx + (isAnswered ? 1 : 0)) / quizQuestions.length) * 100}%` }} />
            </div>
            <div className="flex justify-between items-center text-sm font-mono text-gold">
              <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
              <span>Score: {score}</span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl text-ivory">{question.question}</h3>

            <div className="space-y-3 mt-6">
              {question.options.map((opt, i) => {
                let btnStyle = "bg-maroon/60 border-burgundy text-ivory hover:border-gold/40";
                if (isAnswered) {
                  if (i === question.correct) {
                    btnStyle = "bg-emerald-900/60 border-emerald-500 text-emerald-200";
                  } else if (i === selectedOption) {
                    btnStyle = "bg-rose-900/60 border-rose-500 text-rose-200";
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-4 rounded-sm border transition-all duration-200 flex items-center justify-between hover:-translate-y-0.5 active:scale-[0.99] ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && i === question.correct && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isAnswered && i === selectedOption && i !== question.correct && <XCircle className="w-5 h-5 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-6 p-4 rounded-sm bg-burgundy/60 border border-gold/20 space-y-4">
                <p className="text-sm text-ivory/80">{question.explanation}</p>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-crimson text-ivory rounded-sm font-mono text-xs uppercase tracking-wider hover:bg-gold hover:text-maroon transition-all"
                >
                  {currentIdx + 1 < quizQuestions.length ? "Next Question" : "See Final Score"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 bg-burgundy/40 border border-crimson/20 rounded-sm p-12 text-center space-y-6">
            <Award className="w-16 h-16 text-gold mx-auto" />
            <h3 className="font-display text-4xl text-ivory">Quiz Completed!</h3>
            <p className="font-serif text-xl text-ivory/80">You scored <span className="text-gold font-bold">{score}</span> out of {quizQuestions.length}</p>
            <button
              onClick={restartQuiz}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-crimson text-ivory rounded-sm font-mono text-xs uppercase tracking-wider hover:bg-gold hover:text-maroon transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};