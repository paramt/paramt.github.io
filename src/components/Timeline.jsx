import { useState } from "react";
import { timeline } from "../data/timeline";
import WorldMap from "./WorldMap";

export default function Timeline() {
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const flat = timeline.flatMap((group) =>
    group.events.map((event) => ({ ...event, year: group.year }))
  );

  return (
    <section className="section timeline-section" id="timeline">
      <div className="timeline-layout">
        <div className="timeline-col">
          <h2 className="section-title">Timeline</h2>
          <p className="section-subtitle">a microblog of things I've done</p>
          <div className="timeline">
            {flat.map((event, i) => {
              const nextEvent = flat[i + 1];
              const showYearAfter = !nextEvent || event.year !== nextEvent.year;
              const hasCoords = event.lat != null && event.lng != null;
              return (
                <div key={i}>
                  <div
                    className="timeline-event"
                    onMouseEnter={() => hasCoords && setHoveredCoords({ lat: event.lat, lng: event.lng })}
                    onMouseLeave={() => setHoveredCoords(null)}
                  >
                    <span className="timeline-month">{event.month}</span>
                    <div className="timeline-line-content">
                      <div className={`timeline-dot${hasCoords ? " timeline-dot-locatable" : ""}`} />
                      <div className="timeline-body">
                        <div className="timeline-header">
                          {event.link ? (
                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="timeline-title">
                              {event.title}
                            </a>
                          ) : (
                            <span className="timeline-title">{event.title}</span>
                          )}
                        </div>
                        {event.description && (
                          <p className="timeline-desc">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {showYearAfter && (
                    <div className="timeline-year-marker">
                      <span className="timeline-year">{event.year}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="timeline-map-col" aria-hidden="true">
          <WorldMap coords={hoveredCoords} />
        </div>
      </div>
    </section>
  );
}
