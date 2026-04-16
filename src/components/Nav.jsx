export default function Nav() {
  const links = [
    { href: "/#projects", label: "Projects" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/notes", label: "Notes" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="/" className="nav-name">param.me</a>
        <div className="nav-links">
          {links.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}
