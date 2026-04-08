import { useRef, useMemo } from 'react';
import Tack from './Tack';

export default function Polaroid({ src, alt = "", video, rotate, color = false, location, date, priority = false }) {
  const videoRef = useRef(null);

  const deg = useMemo(() => {
    if (rotate !== undefined) return rotate;
    return (Math.random() - 0.5) * 10;
  }, [rotate]);

  function handleMouseEnter() {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }

  function handleMouseLeave() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  const hasMeta = !!(location || date);
  const classes = ['polaroid', video && 'polaroid-live', color && 'polaroid-color', hasMeta && 'polaroid-has-meta']
    .filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{ '--polaroid-rotate': `${deg}deg` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Tack size={5} style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }} />
      <div className="polaroid-media">
        <img src={src} alt={alt} fetchPriority={priority ? "high" : "auto"} />
        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            playsInline
            loop
            className="polaroid-video"
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
