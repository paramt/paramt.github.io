import { useRef, useMemo } from 'react';

export default function Polaroid({ src, alt = "", video, rotate, color = false }) {
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

  const classes = ['polaroid', video && 'polaroid-live', color && 'polaroid-color']
    .filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{ '--polaroid-rotate': `${deg}deg` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="polaroid-media">
        <img src={src} alt={alt} />
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
    </div>
  );
}
