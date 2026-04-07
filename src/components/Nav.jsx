import { GitHubIcon, LinkedInIcon } from "./Icons";

export default function Nav() {
  const links = [
    { href: "#projects", label: "Projects" },
    { href: "#timeline", label: "Timeline" },
  ];

  return (
    <nav className="nav">
      <a href="#top" className="nav-name">param.me</a>
      <div className="nav-links">
        {links.map(({ href, label }) => (
          <a key={href} href={href}>{label}</a>
        ))}
        <a href="https://linkedin.com/in/paramt" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
        <a href="https://github.com/paramt" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GitHubIcon />
        </a>
      </div>
    </nav>
  );
}
