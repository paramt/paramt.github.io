import { timeline } from "../data/timeline";

export default function Timeline() {
  // Flatten in newest-first order
  const flat = timeline.flatMap((group) =>
    group.events.map((event) => ({ ...event, year: group.year }))
  );

  return (
    <section className="section" id="timeline">
      <h2 className="section-title">Timeline</h2>
      <p className="section-subtitle">a microblog of things I've done</p>
      <div className="timeline">
        {flat.map((event, i) => {
          const nextEvent = flat[i + 1];
          const showYearAfter = !nextEvent || event.year !== nextEvent.year;
          return (
            <div key={i}>
              <div className="timeline-event">
                <span className="timeline-month">{event.month}</span>
                <div className="timeline-line-content">
                  <div className="timeline-dot" />
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
    </section>
  );
}
