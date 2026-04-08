import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import "./index.css";

export default function App() {
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/paramt/paramt.github.io/commits?per_page=1")
      .then((r) => r.json())
      .then((data) => {
        const date = new Date(data[0].commit.committer.date);
        setLastUpdated(date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
      </main>
      <Timeline />
      <footer className="footer">
        <span>param thakkar</span>
        {lastUpdated && <span className="footer-updated">last updated {lastUpdated.toLowerCase()}</span>}
      </footer>
    </>
  );
}
