import { useState, useEffect } from "react";

interface Props {
  current?: string;
}

const links = [
  { id: "home",      label: "Maison",       href: "/" },
  { id: "traiteur",  label: "Traiteur",      href: "/traiteur" },
  { id: "bar-mobile",label: "Bar Mobile",    href: "/bar-mobile" },
  { id: "contact",   label: "Contact",       href: "/contact" },
];

export default function NavIsland({ current = "home" }: Props) {
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
        {/* Logo */}
        <a href="/" className="nav-gh-logo">
          CooksBrad
        </a>

        {/* Desktop links */}
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

        {/* Réserver button */}
        <a href="/contact" className="nav-gh-cta">
          Réserver
        </a>

        {/* Hamburger */}
        <button
          className="nav-gh-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={open ? "open" : ""}></span>
          <span className={open ? "open" : ""}></span>
        </button>
      </div>

      {/* Mobile menu */}
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
