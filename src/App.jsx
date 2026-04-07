import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import "./index.css";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Timeline />
      </main>
      <footer className="footer">
        <span>param thakkar · {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
