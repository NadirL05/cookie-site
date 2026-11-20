# CooksBrad — hébergement Cloudflare Workers

Site vitrine Astro statique : accueil, bar mobile, créations, histoire, contact,
mentions légales, confidentialité et page 404. Le formulaire React envoie
directement vers le service Formspree existant. Aucun compte client, paiement,
stockage serveur ou base de données n'est présent dans cette version.

## Développement et vérifications

Node.js >= 22.12.0, puis :

```sh
npm ci
npm run build
npx playwright install chromium
npm run test:worker
npm run deploy:dry-run
```

La recette démarre Wrangler uniquement sur 127.0.0.1, vérifie les routes, les
ressources et les en-têtes, puis teste le menu mobile et le formulaire dans
Chromium. Tous les appels externes du navigateur sont interceptés ; les réponses
Formspree sont simulées, aucun message réel n'est envoyé. Le port de recette
peut être choisi avec COOKSBRAD_TEST_PORT (43158 par défaut).

## Architecture de production

`wrangler.json` publie uniquement le répertoire `dist/` comme ressources
statiques Workers, avec les domaines `cooksbrad.fr` et `www.cooksbrad.fr`.
Aucun adaptateur SSR ni script serveur n'est nécessaire. Comme Mont d'Or Paysage,
les pages sont servies par les ressources statiques de Workers ; son adaptateur
Astro et sa fonction /api/devis ne s'appliquent pas au formulaire Formspree de ce
site. Aucun nouveau service payant n'est requis.

Les URLs canoniques et le sitemap restent sur `https://www.cooksbrad.fr/`.
Les pages gardent leur slash final. La réponse 404 reste une vraie 404 et utilise
la page personnalisée. Les règles de sécurité/CSP de `public/_headers` sont
conservées ; les règles cache des pages correspondent à leurs URLs avec slash.

Le formulaire conserve `PUBLIC_FORMSPREE_ID`, variable **publique au build**,
avec le même repli versionné `xzdqnlkb`. Un éventuel identifiant public de
production différent doit être confirmé par l'opérateur avant le build. Aucun
secret serveur n'est requis. La balise Cloudflare Web Analytics publique déjà
versionnée est conservée. Les fichiers d'environnement ne doivent pas être
copiés dans Git ni dans le paquet publié.

## Publication opérateur

Après sélection du compte Cloudflare existant qui possède la zone, avec une
authentification déjà autorisée :

```sh
npm ci
npm run build
npm run test:worker
npm run deploy:dry-run
npx wrangler deploy
```

La dernière commande publie le site et associe les deux domaines. Elle est
réservée au responsable de la bascule ; la préparation locale ne la lance pas.
`workers.dev` et les URLs de prévisualisation sont désactivés.

Le dépôt mentionne une bascule Cloudflare Pages le 9 novembre 2026. Examiner
le projet Pages et ses domaines actuels avant de créer une nouvelle liaison
Workers ; relever la configuration existante et conserver un retour arrière.
La sonde publique du 20 novembre voit déjà apex → www (301), puis un 403
Cloudflare sur www : elle ne permet pas d’identifier l’origine derrière ce refus.

Avant cette commande, sauvegarder les seuls enregistrements web apex/www et les
règles de redirection concernés par la bascule. Préserver MX, SPF, DKIM, DMARC,
vérifications de domaine et les autres sous-domaines. Conserver le plan gratuit
existant. Ne pas remplacer un enregistrement en conflit sans ce relevé.

Dans les règles de redirection de la zone, conserver ou établir la redirection
permanente de `cooksbrad.fr` vers `https://www.cooksbrad.fr`, avec chemin et
chaîne de requête inchangés. Les redirections de domaine ne sont pas prises en
charge par le fichier `_redirects` des ressources Workers.

Vérifier publiquement HTTPS sur les deux noms, toutes les pages, images/CSS/JS,
les redirections, la 404, le menu mobile et le formulaire avec interception.
La livraison effective des messages Formspree n'est pas prouvée par la recette
simulée et nécessite une vérification distincte autorisée côté propriétaire.

Pour revenir en arrière : restaurer les enregistrements web/règles sauvegardés,
ou republier une version Workers précédemment vérifiée si elle existe. L'ancien
hébergement Vercel étant suspendu, le rétablissement DNS seul ne garantit pas
un ancien site fonctionnel.

## Références

- [Ressources statiques Workers](https://developers.cloudflare.com/workers/static-assets/)
- [Routage HTML](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [En-têtes](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Redirections et leurs limites](https://developers.cloudflare.com/workers/static-assets/redirects/)
- [Tarification des ressources statiques](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
