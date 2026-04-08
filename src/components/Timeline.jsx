import { useState, useEffect, useRef, useMemo } from "react";
import { timeline } from "../data/timeline";
import WorldMap from "./WorldMap";
import Polaroid from "./Polaroid";
import Tack from "./Tack";

export default function Timeline() {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const sectionRef = useRef(null);
  const entryRefs = useRef(new Map());
  const hoverSourceRef = useRef(null);    // 'timeline' | 'map' | null
  const selectedSourceRef = useRef(null); // 'timeline' | 'map' | null

  const flat = useMemo(() => timeline.flatMap((group) =>
    group.events.map((event) => ({ ...event, year: group.year }))
  ), []);

  useEffect(() => {
    // Polaroids are hidden below 860px — skip preloading on those devices
    if (window.innerWidth < 860) return;

    const images = flat.flatMap(e => (e.images ?? []).map(img => img.src ?? img));
    if (images.length === 0) return;

    let preloaded = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !preloaded) {
          preloaded = true;
          observer.disconnect();
          const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
          idle(() => images.forEach(src => { new Image().src = src; }));
        }
      },
      { rootMargin: '800px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedEvent && selectedSourceRef.current === 'map') {
      entryRefs.current.get(selectedEvent)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedEvent]);

  const allCoords = flat
    .filter((e) => e.lat != null && e.lng != null)
    .map((e) => ({ lat: e.lat, lng: e.lng, event: e }));

  const activeEvent = hoveredEvent ?? selectedEvent;
  const activeCoords = activeEvent?.lat != null ? { lat: activeEvent.lat, lng: activeEvent.lng } : null;
  const activeImages = activeEvent?.images ?? [];
  const noZoom = hoveredEvent
    ? hoverSourceRef.current === 'map'
    : selectedEvent
      ? selectedSourceRef.current === 'map'
      : false;

  return (
    <section className="section timeline-section" id="timeline" ref={sectionRef}>
      <div className="timeline-layout">
        <div className="timeline-col">
          <h2 className="section-title">Timeline</h2>
          <p className="section-subtitle">A microblog of things I've done.<span className="timeline-hover-hint"> Hover over an event to see more details!</span></p>
          <div className="timeline">
            {flat.map((event, i) => {
              const nextEvent = flat[i + 1];
              const showYearAfter = !nextEvent || event.year !== nextEvent.year;
              const hasCoords = event.lat != null && event.lng != null;
              return (
                <div key={i}>
                  <div
                    ref={(el) => { el ? entryRefs.current.set(event, el) : entryRefs.current.delete(event); }}
                    className={`timeline-event${activeEvent === event ? " timeline-event--active" : ""}${selectedEvent === event ? " timeline-event--selected" : ""}`}
                    onMouseEnter={() => { hoverSourceRef.current = 'timeline'; setHoveredEvent(event); }}
                    onMouseLeave={() => { hoverSourceRef.current = null; setHoveredEvent(null); }}
                    onClick={() => { selectedSourceRef.current = 'timeline'; setSelectedEvent(prev => prev === event ? null : event); }}
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

        <div className="timeline-map-col" aria-hidden="true" onMouseLeave={() => { hoverSourceRef.current = null; setHoveredEvent(null); }}>
          <div className="map-frame">
            <svg className="map-string" aria-hidden="true">
              <line x1="50%" y1="9" x2="28%" y2="38" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="50%" y1="9" x2="72%" y2="38" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <Tack size={8} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
            <WorldMap
              coords={activeCoords}
              allCoords={allCoords}
              noZoom={noZoom}
              onMarkerHover={(event) => { hoverSourceRef.current = 'map'; setHoveredEvent(event); }}
              onMarkerLeave={() => { hoverSourceRef.current = null; setHoveredEvent(null); }}
              onMarkerClick={(event) => { selectedSourceRef.current = 'map'; setSelectedEvent(prev => prev === event ? null : event); }}
            />
          </div>
          {activeImages.length > 0 && (
            <div className="timeline-polaroids">
              {activeImages.map((img, i) => (
                <Polaroid key={i} src={img.src ?? img} thumb={img.thumb} color />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
