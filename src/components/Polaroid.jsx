import { useRef, useMemo, useState, useEffect } from 'react';
import Tack from './Tack';

const FILTER_DURATION = 400; // ms — must match transition in CSS

export default function Polaroid({ src, thumb, alt = "", video, rotate, color = false, static: isStatic = false, location, date, priority = false, tack = true, onClick, w, h }) {
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const thumbImgRef = useRef(null);
  const playTimerRef = useRef(null);
  const imgReadyTimerRef = useRef(null);
  const [loaded, setLoaded] = useState(!thumb);
  const [imgReady, setImgReady] = useState(!thumb);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const deg = useMemo(() => {
    if (rotate !== undefined) return rotate;
    return (Math.random() - 0.5) * 10;
  }, [rotate]);

  useEffect(() => {
    if (thumb && imgRef.current?.complete) {
      setLoaded(true);
      setImgReady(true);
    }
  }, [thumb]);

  useEffect(() => {
    if (thumb && thumbImgRef.current?.complete) {
      setThumbLoaded(true);
    }
  }, [thumb]);

  useEffect(() => {
    return () => {
      clearTimeout(playTimerRef.current);
      clearTimeout(imgReadyTimerRef.current);
    };
  }, []);

  function handleImgLoad() {
    setLoaded(true);
    if (thumb) {
      imgReadyTimerRef.current = setTimeout(() => setImgReady(true), FILTER_DURATION);
    } else {
      setImgReady(true);
    }
  }

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

  let imgClass;
  if (!loaded) imgClass = 'polaroid-img-loading';
  else if (!imgReady) imgClass = 'polaroid-img-fading';
  else imgClass = undefined;

  return (
    <div
      className={classes}
      style={{ '--polaroid-rotate': `${deg}deg`, cursor: onClick ? 'pointer' : undefined }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {tack && <Tack size={5} style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }} />}
      <div className="polaroid-media" style={{ aspectRatio: w && h ? `${w}/${h}` : (!thumbLoaded ? '3/2' : undefined) }}>
        {!loaded && (
          <div className={`polaroid-placeholder${thumb && thumbLoaded ? ' polaroid-placeholder-fade' : ''}`} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {thumb && !imgReady && (
          <img ref={thumbImgRef} src={thumb} aria-hidden="true" className="polaroid-thumb" fetchPriority={priority ? "high" : "auto"} onLoad={() => setThumbLoaded(true)} />
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          fetchPriority={priority ? "high" : "auto"}
          className={imgClass}
          onLoad={handleImgLoad}
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
