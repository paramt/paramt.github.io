import { useState, useLayoutEffect } from 'react';
import heroPolaroids from '../data/heroPolaroids';
import Polaroid from './Polaroid';

const STORAGE_KEY = 'heroPolaroidIndex';

export default function Hero() {
  const [featured, setFeatured] = useState(heroPolaroids[0]);

  useLayoutEffect(() => {
    const step = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    localStorage.setItem(STORAGE_KEY, (step + 1) % heroPolaroids.length);
    setFeatured(heroPolaroids[step % heroPolaroids.length]);
  }, []);

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
      <Polaroid src={featured.image} thumb={featured.thumb} alt="Param Thakkar" video={featured.video} rotate={2} location={featured.location} date={featured.date} priority />
      </div>
      <a href="#projects" className="hero-scroll" aria-label="Scroll down">↓</a>
    </section>
  );
}
