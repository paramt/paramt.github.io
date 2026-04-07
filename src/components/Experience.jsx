import { experience } from "../data/experience";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <h2 className="section-title">Experience</h2>
      <div className="experience-list">
        {experience.map((job) => (
          <div key={job.company} className="experience-item">
            <div className="experience-header">
              <div>
                {job.link ? (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="experience-company"
                  >
                    {job.company} ↗
                  </a>
                ) : (
                  <span className="experience-company">{job.company}</span>
                )}
              </div>
              <div className="experience-meta">
                <span>{job.period}</span>
                <span className="experience-location">{job.location}</span>
              </div>
            </div>
            <p className="experience-desc">{job.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
