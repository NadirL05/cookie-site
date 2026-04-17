import { useState, useEffect } from "react";

interface Props {
  current?: string;
}

const links = [
  { id: "home", label: "Maison", href: "/" },
  { id: "creations", label: "Nos Créations", href: "/creations" },
  { id: "histoire", label: "Notre Histoire", href: "/histoire" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function NavIsland({ current = "home" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-inner container">
        <a href="/" className="nav-logo">
          <span className="nav-logo-mark">LM</span>
          <span className="nav-logo-word">
            <span className="display" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>
              La Maison
            </span>
            <span className="nav-logo-sub">Paris · depuis 2015</span>
          </span>
        </a>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.id}>
              <a href={l.href} className={`nav-link ${current === l.id ? "is-current" : ""}`}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="/contact" className="nav-cta">
          <span>Commander</span>
          <span className="arrow">→</span>
        </a>

        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span></span>
          <span></span>
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          {links.map((l) => (
            <a key={l.id} href={l.href} className="nav-mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
            Commander <span className="arrow">→</span>
          </a>
        </div>
      )}
    </nav>
  );
}
