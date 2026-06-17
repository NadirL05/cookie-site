import { useState, useEffect } from "react";

const links = [
  { id: "bar-mobile",  label: "Bar Mobile",      href: "/bar-mobile" },
  { id: "creations",   label: "Nos Créations",   href: "/creations" },
  { id: "histoire",    label: "Notre Histoire",  href: "/histoire" },
];

export default function NavIsland({ current = "home" }: { current?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav-gh${scrolled ? " nav-gh-scrolled" : ""}`}>
      <div className="nav-gh-inner">
        <a href="/" className="nav-logo">
          <span className="nav-logo-mono">CB</span>
          <div className="nav-logo-text">
            <span className="nav-logo-brand">CooksBrad</span>
            <span className="nav-logo-sub">PACA</span>
          </div>
        </a>

        <ul className="nav-gh-links">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                className={`nav-gh-link${current === l.id ? " nav-gh-link-active" : ""}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="/contact" className="nav-gh-cta">Réserver</a>

        <button
          className="nav-gh-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={open ? "open" : ""}></span>
          <span className={open ? "open" : ""}></span>
        </button>
      </div>

      {open && (
        <div className="nav-gh-mobile">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={`nav-gh-mobile-link${current === l.id ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="/contact" className="nav-gh-mobile-cta" onClick={() => setOpen(false)}>
            Réserver
          </a>
        </div>
      )}
    </nav>
  );
}
