import { projects } from "../data/projects";
import { GitHubIcon } from "./Icons";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <h2 className="section-title">Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.name} className="project-card">
            <div className="project-header">
              <h3 className="project-name">{project.name}</h3>
              <div className="project-links">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer">↗</a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <GitHubIcon size={14} />
                  </a>
                )}
              </div>
            </div>
            <p className="project-desc">{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
