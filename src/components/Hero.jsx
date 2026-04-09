import { useState, useLayoutEffect, useRef } from 'react';
import heroPolaroids from '../data/heroPolaroids';
import Polaroid from './Polaroid';

const STORAGE_KEY = 'heroPolaroidIndex';
const _preloaded = []; // keep refs alive so browser doesn't evict from memory cache

export default function Hero() {
  const [index, setIndex] = useState(null);
  const initializedRef = useRef(false);

  useLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const step = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    localStorage.setItem(STORAGE_KEY, (step + 1) % heroPolaroids.length);
    setIndex(step % heroPolaroids.length);

    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 500));
    idle(() => {
      heroPolaroids.forEach(p => { if (p.thumb) { const t = new Image(); t.src = p.thumb; _preloaded.push(t); } });
      heroPolaroids.forEach(p => { const img = new Image(); img.src = p.image; _preloaded.push(img); });
      heroPolaroids.forEach(p => { if (p.video) { const v = document.createElement('video'); v.src = p.video; v.preload = 'auto'; _preloaded.push(v); } });
    });
  }, []);

  function handleClick() {
    setIndex(prev => {
      const next = (prev + 1) % heroPolaroids.length;
      localStorage.setItem(STORAGE_KEY, (next + 1) % heroPolaroids.length);
      return next;
    });
  }

  const featured = index !== null ? heroPolaroids[index] : null;

  return (
    <section className="hero" id="top">
      <div className="hero-inner">
      <div className="hero-content">
        <h1>Param Thakkar</h1>
        <p className="hero-sub">
          I study CS @ Waterloo, and in the summer I'll be interning at Databricks. In the past, I've worked on:
        </p>
        <ul className="hero-experience">
          <li>ML-driven ads targeting @ Quora</li>
          <li>
            <a href="https://www.glean.com/blog/intern-life-at-glean#deep-research" target="_blank" rel="noopener noreferrer">
              Deep research evals
            </a>
            {" "}@ Glean
          </li>
        </ul>
        <div className="hero-links">
          <a href="https://github.com/paramt" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/paramt" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:p28thakk@uwaterloo.ca">Email</a>
        </div>
      </div>
      {featured && <Polaroid key={index} src={featured.image} thumb={featured.thumb} alt="Param Thakkar" video={featured.video} rotate={2} location={featured.location} date={featured.date} priority tack={false} onClick={handleClick} />}
      </div>
      <a href="#projects" className="hero-scroll" aria-label="Scroll down">↓</a>
    </section>
  );
}
