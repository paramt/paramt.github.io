import { useRef, useMemo, useState, useEffect } from 'react';
import Tack from './Tack';

const FILTER_DURATION = 400; // ms — must match transition in CSS

export default function Polaroid({ src, thumb, alt = "", video, rotate, color = false, static: isStatic = false, location, date, priority = false, tack = true, onClick }) {
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const playTimerRef = useRef(null);
  const [loaded, setLoaded] = useState(!thumb);
  const [playing, setPlaying] = useState(false);

  const deg = useMemo(() => {
    if (rotate !== undefined) return rotate;
    return (Math.random() - 0.5) * 10;
  }, [rotate]);

  useEffect(() => {
    if (thumb && imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [thumb]);

  useEffect(() => {
    return () => clearTimeout(playTimerRef.current);
  }, []);

  function handleMouseEnter() {
    if (!video) return;
    if (videoRef.current) videoRef.current.load();
    playTimerRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setPlaying(true);
      }
    }, FILTER_DURATION);
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
        {thumb && !loaded && (
          <img src={thumb} aria-hidden="true" className="polaroid-thumb" />
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          fetchPriority={priority ? "high" : "auto"}
          className={thumb && !loaded ? 'polaroid-img-loading' : undefined}
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
