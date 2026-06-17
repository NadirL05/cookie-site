import { useState, useEffect } from "react";

const links = [
  { id: "bar-mobile",  label: "Bar Mobile",      href: "/bar-mobile" },
  { id: "creations",   label: "Nos Créations",   href: "/creations" },
  { id: "histoire",    label: "Notre Histoire",  href: "/histoire" },
];

type NavIslandProps = {
  current?: string;
};

export default function NavIsland({ current = "home" }: NavIslandProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClose = () => setOpen(false);

  return (
    <nav className={`nav-gh${scrolled ? " nav-gh-scrolled" : ""}`}>
      <div className="nav-gh-inner">
        {/* Logo — taille contrôlée via CSS, compact sur mobile */}
        <a href="/" className="nav-logo" aria-label="CooksBrad — retour à l'accueil">
          <span className="nav-logo-mono">CB</span>
          <div className="nav-logo-text">
            <span className="nav-logo-brand">CooksBrad</span>
            <span className="nav-logo-sub">PACA</span>
          </div>
        </a>

        {/* Liens desktop : cachés sur mobile */}
        <ul className="nav-gh-links" role="list">
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

        {/* CTA desktop : caché sur mobile */}
        <a href="/contact" className="nav-gh-cta">Réserver</a>

        {/* Bouton hamburger : visible uniquement sur mobile */}
        <button
          className="nav-gh-burger"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="nav-mobile-menu"
        >
          <span className={open ? "open" : ""}></span>
          <span className={open ? "open" : ""}></span>
        </button>
      </div>

      {/* Overlay mobile — plein écran avec scroll interne si nécessaire */}
      {open && (
        <div
          id="nav-mobile-menu"
          className="nav-gh-mobile"
          role="dialog"
          aria-label="Menu de navigation"
        >
          <nav className="nav-gh-mobile-inner">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.href}
                className={`nav-gh-mobile-link${current === l.id ? " active" : ""}`}
                onClick={handleClose}
              >
                {l.label}
              </a>
            ))}
            {/* Bouton Réserver bien visible dans le menu mobile */}
            <a
              href="/contact"
              className="nav-gh-mobile-cta"
              onClick={handleClose}
            >
              Réserver
            </a>
          </nav>
        </div>
      )}
    </nav>
  );
}
