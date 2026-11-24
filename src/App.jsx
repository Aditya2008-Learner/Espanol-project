import React from 'react';
import { Header } from './components/Header.jsx';
import { ChapterOne } from './components/ChapterOne.jsx';
import { ChapterTwo } from './components/ChapterTwo.jsx';
import { ChapterThree } from './components/ChapterThree.jsx';
import { ChapterFour } from './components/ChapterFour.jsx';
import { ChapterFive } from './components/ChapterFive.jsx';
import { ChapterSix } from './components/ChapterSix.jsx';
import { ChapterSeven } from './components/ChapterSeven.jsx';
import { ChapterEight } from './components/ChapterEight.jsx';
import { ChapterNine } from './components/ChapterNine.jsx';
import { ChapterTen } from './components/ChapterTen.jsx';
import { ChapterEleven } from './components/ChapterEleven.jsx';
import { ProgressBar } from './components/ProgressBar.jsx';
import { ChapterRail } from './components/ChapterRail.jsx';
import { Atmosphere } from './components/Atmosphere.jsx';

function App() {
  return (
    <div className="font-sans antialiased">
      <Header />
      <ProgressBar />
      <Atmosphere />
      <ChapterRail />
      <main className="snap-y snap-mandatory overflow-y-scroll h-screen">
        <section id="chapter-1" className="snap-start min-h-screen">
          <ChapterOne />
        </section>
        <section id="chapter-2" className="snap-start min-h-screen">
          <ChapterTwo />
        </section>
        <section id="chapter-3" className="snap-start min-h-screen">
          <ChapterThree />
        </section>
        <section id="chapter-4" className="snap-start min-h-screen">
          <ChapterFour />
        </section>
        <section id="chapter-5" className="snap-start min-h-screen">
          <ChapterFive />
        </section>
        <section id="chapter-6" className="snap-start min-h-screen">
          <ChapterSix />
        </section>
        <section id="chapter-7" className="snap-start min-h-screen">
          <ChapterSeven />
        </section>
        <section id="chapter-8" className="snap-start min-h-screen">
          <ChapterEight />
        </section>
        <section id="chapter-9" className="snap-start min-h-screen">
          <ChapterNine />
        </section>
        <section id="chapter-10" className="snap-start min-h-screen">
          <ChapterTen />
        </section>
        <section id="chapter-11" className="snap-start min-h-screen">
          <ChapterEleven />
        </section>
      </main>
    </div>
  );
}

export default App;
