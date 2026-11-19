# Fútbol Español - Immersive Interactive Documentary Website

A premium cinematic football documentary experience exploring Spanish football history, culture, clubs, tactics, and legends.

## Project Overview

This is an immersive, visually spectacular interactive website built as a digital football documentary. Built with React, Tailwind CSS, and GSAP for smooth animations.

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **GSAP** with ScrollTrigger for cinematic animations
- **Lucide React** for icons

## Development

```bash
npm install
npm run dev
```

The development server runs on http://localhost:3000

## Project Structure

```
src/
├── components/
│   ├── ChapterOne.jsx - Hero introduction
│   ├── ChapterTwo.jsx - Historical timeline
│   ├── ChapterThree.jsx - Club giants
│   ├── ChapterFour.jsx - El Clásico
│   ├── ChapterFive.jsx - Golden generation
│   ├── ChapterSix.jsx - Tiki-Taka tactics
│   ├── ChapterSeven.jsx - Legends gallery
│   ├── ChapterEight.jsx - Modern era
│   ├── ChapterNine.jsx - Interactive quiz (15 questions)
│   ├── ChapterTen.jsx - Cinematic closing
│   ├── Header.jsx - Navigation
│   └── ProgressBar.jsx - Scroll indicator
├── data/
│   └── footballData.js - Timeline, clubs, legends, quiz data
├── App.jsx - Main app component
├── main.jsx - Entry point
└── index.css - Global styles with Tailwind
```

## Chapters

1. **El Inicio** - Cinematic hero
2. **Las Raíces** - Interactive historical timeline
3. **Los Gigantes** - Club selector with modals
4. **El Clásico** - Rivalry showcase
5. **La Generación Dorada** - Spain's golden era
6. **Tiki-Taka** - Interactive tactical pitch
7. **Leyendas** - Player gallery
8. **La Modernidad** - Current era
9. **El Cuestionario** - 15 question quiz
10. **El Final** - Cinematic closing

## Design System

**Colors:**
- Midnight Burgundy: #350D19
- Spanish Crimson: #B51F35
- Deep Maroon: #190A10
- Warm Ivory: #F4EFE5
- Mediterranean Gold: #D5AA61

**Typography:**
- Display: Bebas Neue / Anton
- Editorial: Playfair Display
- Body: Inter / Manrope
- Stats: Space Grotesk
