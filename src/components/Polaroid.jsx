import { useRef, useMemo, useState, useEffect } from 'react';
import Tack from './Tack';

export default function Polaroid({ src, w, h, alt = "", video, rotate, color = false, static: isStatic = false, location, date, priority = false, tack = true, onClick }) {
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const playTimerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const deg = useMemo(() => {
    if (rotate !== undefined) return rotate;
    return (Math.random() - 0.5) * 10;
  }, [rotate]);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  useEffect(() => {
    return () => clearTimeout(playTimerRef.current);
  }, []);

  function handleMouseEnter() {
    if (!video) return;
    playTimerRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setPlaying(true);
      }
    }, 200);
  }

  function handleMouseLeave() {
    clearTimeout(playTimerRef.current);
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  const hasMeta = !!(location || date);
  const classes = ['polaroid', video && 'polaroid-live', color && 'polaroid-color', isStatic && 'polaroid-static', hasMeta && 'polaroid-has-meta']
    .filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{ '--polaroid-rotate': `${deg}deg`, cursor: onClick ? 'pointer' : undefined }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {tack && <Tack size={5} style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }} />}
      <div className="polaroid-media">
        {!loaded && (
          <>
            <div style={{ aspectRatio: w && h ? `${w}/${h}` : '3/2' }} aria-hidden="true" />
            <div className="polaroid-placeholder" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </>
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          fetchPriority={priority ? "high" : "auto"}
          className={!loaded ? 'polaroid-img-loading' : undefined}
          onLoad={() => setLoaded(true)}
        />
        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            playsInline
            loop
            className={`polaroid-video${playing ? ' polaroid-video-playing' : ''}`}
          />
        )}
      </div>
      {(location || date) && (
        <div className="polaroid-meta">
          {location && <span className="polaroid-location">{location}</span>}
          {date && <span className="polaroid-date">{date}</span>}
        </div>
      )}
    </div>
  );
}
