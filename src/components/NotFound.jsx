import heroPolaroids from '../data/heroPolaroids';
import Polaroid from './Polaroid';

const ROTATIONS = [-5, 3, -2, 6, -4, 2];

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-gallery">
        {heroPolaroids.map((p, i) => (
          <Polaroid
            key={i}
            src={p.image}
            thumb={p.thumb}
            w={p.w}
            h={p.h}
            video={p.video}
            rotate={ROTATIONS[i]}
            location={p.location}
            date={p.date}
            tack={false}
          />
        ))}
      </div>
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <a href="/" className="not-found-link">← go home</a>
      </div>
    </div>
  );
}
