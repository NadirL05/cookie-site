# Cahier des charges — Site vitrine Cookies Artisanaux

**Date :** 2026-04-17
**Statut :** Validé

---

## Contexte

Site vitrine pour une artisane cookie-maker. Objectif : présenter les créations, raconter l'histoire de la marque, et rediriger les clients vers Instagram/email pour commander. Pas de boutique en ligne pour l'instant.

**Inspiration :** CooksBrad.fr + brookibakehouse.com
**Ambiance :** Haut de gamme artisanal, chaleureux, premium — pas flashy.

---

## Stack technique

| Choix | Détail |
|---|---|
| Framework | **Astro** (`npm create astro@latest`) |
| Styles | **Tailwind CSS v3** (compatible Astro, `@astrojs/tailwind`) |
| Déploiement | **Vercel** (free tier) |
| Formulaire contact | **Formspree** (free, no backend needed) |
| Images | **Unsplash** (placeholder) → remplacées par les vraies photos |
| Polices | **Cormorant Garamond** (serif élégant) + **DM Sans** (corps/nav) via Google Fonts |

---

## Palette couleurs

| Rôle | Couleur | Hex |
|---|---|---|
| Primaire (fond sombre) | Vert sapin | `#1C3A2A` |
| Fond clair | Beige crème | `#F5EFE0` |
| Accent doré | Or brun chaud | `#C8A97E` |
| Vert intermédiaire | Vert forêt | `#2E5040` |
| Texte sombre | Brun foncé | `#2C1810` |

---

## Typographie

| Usage | Police | Style |
|---|---|---|
| Logo / Titres H1 | Cormorant Garamond | Italic, 400 |
| Sous-titres / H2-H3 | Cormorant Garamond | Regular, 300 |
| Labels / Nav / CTA | DM Sans | Uppercase, letter-spacing: 0.15em |
| Corps de texte | DM Sans | Regular, 400 |

---

## Pages

### 1. Accueil (`/`)

**Sections dans l'ordre :**

1. **Navigation** — Logo script (gauche) + liens texte uppercase (droite) : Notre Histoire · Nos Créations · Contact
2. **Hero** — Fond beige, headline en 2 lignes italique + photo cookies plein cadre à droite + CTA bouton vert "Découvrir nos créations →"
3. **Produits vedettes** — Titre "Les créations du moment" + grille 3 cookies (photo ronde/carrée + nom + prix) + bouton outline "Voir toutes nos créations"
4. **Bande Histoire** — Fond vert sapin, photo artisane (gauche) + citation italique + lien "Lire notre histoire →"
5. **CTA Contact** — Fond beige, phrase courte + 2 boutons côte à côte : "Instagram" + "Nous écrire"
6. **Footer** — Fond vert sapin, logo script (gauche) + copyright (droite)

---

### 2. Nos Créations (`/creations`)

**Sections :**

1. **Header de page** — Titre "Nos Créations" + sous-titre sur fond beige
2. **Grille produits** — 3 colonnes desktop / 2 colonnes mobile, chaque carte : photo + nom + description courte (2 lignes) + prix
3. **CTA bas de page** — "Envie d'une création ? Commandez sur Instagram" + bouton

**Données produits (placeholder à remplacer) :**
- Chocolat Noir & Fleur de Sel — 3,50 €
- Praliné Croustillant — 3,50 €
- Citron Confit & Pavot — 3,50 €
- Caramel Beurre Salé — 3,50 €
- Pistache & Framboise — 4,00 €
- Spéculoos Maison — 3,00 €

---

### 3. Notre Histoire (`/histoire`)

**Sections :**

1. **Header** — Grande photo (pleine largeur, overlay vert sapin semi-transparent) + titre "Notre Histoire" centré
2. **Texte principal** — 2-3 paragraphes artisanat / passion / origine — colonnes desktop
3. **Valeurs** — 3 icônes SVG simples + label : "Fait main" · "Ingrédients locaux" · "Sans compromis"
4. **Citation** — Fond vert sapin, citation longue en italic centrée
5. **CTA** — Lien vers Nos Créations

---

### 4. Contact (`/contact`)

**Sections :**

1. **Header** — Titre + sous-titre "Pour commander, poser une question ou proposer un événement"
2. **2 colonnes** :
   - Gauche : Formulaire Formspree (Nom, Email, Message, bouton Envoyer)
   - Droite : Infos (Instagram @placeholder, email placeholder, localisation ville)
3. **Section Instagram** — Fond vert sapin + lien Instagram en gros

---

## Composants Astro partagés

| Composant | Fichier | Description |
|---|---|---|
| Navigation | `src/components/Nav.astro` | Header sticky, logo + liens, hamburger mobile |
| Footer | `src/components/Footer.astro` | Fond vert sapin, logo + copyright |
| CookieCard | `src/components/CookieCard.astro` | Carte produit : image + nom + prix |
| Button | `src/components/Button.astro` | Variantes : solid (vert) + outline |
| SectionHeader | `src/components/SectionHeader.astro` | Label uppercase + titre italic |
| Layout | `src/layouts/Layout.astro` | Layout de base : meta, fonts, Nav, Footer |

---

## Structure fichiers

```
cookie site/
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── CookieCard.astro
│   │   ├── Button.astro
│   │   └── SectionHeader.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro        ← Accueil
│   │   ├── creations.astro    ← Nos Créations
│   │   ├── histoire.astro     ← Notre Histoire
│   │   └── contact.astro      ← Contact
│   └── styles/
│       └── global.css
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Responsivité

- **Mobile first** — Tailwind breakpoints `md:` et `lg:`
- Nav → hamburger menu sur mobile
- Grille produits : 1 col mobile / 2 col tablette / 3 col desktop
- Hero : image cachée sur mobile, texte centré

---

## SEO & Performance

- Meta title + description sur chaque page (via frontmatter Astro)
- Images optimisées avec `<Image />` natif d'Astro (`astro:assets`, intégré depuis Astro v3)
- Fonts en `font-display: swap`
- Score Lighthouse cible : 95+ sur toutes métriques

---

## Ce qui est hors scope (pour l'instant)

- Boutique en ligne / paiement
- Blog
- Espace client
- Gestion CMS (peut être ajouté avec Contentful ou Sanity plus tard)
- Multilingue

---

## Vérification finale (checklist déploiement)

- [ ] `npm run build` sans erreur
- [ ] Toutes les pages accessible sur `/`
- [ ] Formulaire contact fonctionnel (Formspree)
- [ ] Score Lighthouse mobile ≥ 90
- [ ] Meta tags corrects sur chaque page
- [ ] Images Unsplash remplacées par vraies photos
- [ ] Nom de marque final intégré partout
- [ ] Déployé sur Vercel avec domaine custom (optionnel)
