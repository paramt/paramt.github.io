import Nav from './Nav';

const VERSIONS = [
  { label: "2026–now",  url: "https://param.me" },
  { label: "2020–2026", url: "https://2025.param.me" },
  { label: "2019–2020", url: "https://2020.param.me" },
  { label: "2018–2019", url: "https://old.param.me" },
];

export default function Archive() {
  return (
    <>
      <Nav links={[]} />
      <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "64px 24px" }}>
        <h1 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>Archive</h1>
        <p style={{ color: "var(--fg-muted)", fontSize: "14px", marginBottom: "40px" }}>
          previous versions of this site
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
          {VERSIONS.map(({ label, url }) => (
            <li key={url} style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
              <span style={{ color: "var(--fg-faint)", fontSize: "13px", minWidth: "80px" }}>{label}</span>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "15px" }}>
                {url.replace("https://", "")}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
