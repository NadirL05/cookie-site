import { useEffect, useRef } from "react";

interface Cookie {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  badge?: string | null;
  image?: string;
  placeholder: string;
  placeholderLabel: string;
}

interface Props {
  cookie: Cookie;
  index: number;
}

export default function CookieCardDesign({ cookie, index }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delayClass = `reveal-delay-${Math.min(index, 5)}`;

  return (
    <article ref={ref} className={`cookie-card reveal ${delayClass}`}>
      <div className="cookie-image-wrap">
        {cookie.image ? (
          <div className="cookie-photo" style={{ backgroundImage: `url(${cookie.image})` }} role="img" aria-label={cookie.name} />
        ) : (
          <div className={`placeholder ${cookie.placeholder}`}>
            <span className="placeholder-label">{cookie.placeholderLabel}</span>
          </div>
        )}
        {cookie.badge && (
          <span className="cookie-badge" title={cookie.badge}>
            <span className="cookie-badge-inner">{cookie.badge}</span>
          </span>
        )}
      </div>
      <div className="cookie-body">
        <div className="cookie-head">
          <h3 className="cookie-name">{cookie.name}</h3>
          <span className="cookie-price">{cookie.price}</span>
        </div>
        <p className="cookie-sub">{cookie.subtitle}</p>
      </div>
    </article>
  );
}

export type { Cookie };
