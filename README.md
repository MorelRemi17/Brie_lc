# Site Cyclo VTT Brie L.C.

Site du club, construit avec [Astro](https://astro.build) d'après la maquette Claude Design
« Site Brie LC » (direction **1a, fidèle à l'affiche**), hébergé sur **Netlify**.

Tout le contenu est généré **au build**, en HTML complet : c'est le meilleur cas pour le référencement.
Chaque événement a sa propre page (`/evenements/<nom-du-fichier>/`), avec les données structurées
qui permettent d'apparaître dans les résultats « événements » de Google.

## Comment ça marche

```
tu modifies un fichier sur GitHub  ──►  Netlify reconstruit le site (≈ 1 min)  ──►  en ligne
```

Pas de SFTP, pas de back-office : le contenu, ce sont des fichiers texte du dépôt. On les modifie
directement sur github.com (bouton ✏️ « Edit », ou « Add file » pour créer ou envoyer un fichier),
ou en local suivi d'un `git push`.

| Je veux…                         | Fichier / dossier                                    |
| -------------------------------- | ---------------------------------------------------- |
| ajouter / modifier un événement  | `src/content/evenements/<nom>.md` (un fichier par événement) |
| ajouter une actu                 | `src/content/actus/<date>-<nom>.md`                  |
| ajouter des photos à la galerie  | déposer les images dans `src/assets/galerie/`        |
| une affiche, une photo d'actu, le logo, la photo d'accueil | déposer l'image dans `src/assets/photos/` et l'appeler par son nom |
| changer téléphone, e-mail, horaires, réseaux | `src/data/club.json`                     |
| les 3 cartes « Nos sorties »     | `src/data/sorties.json`                              |
| les partenaires                  | `src/data/partenaires.json` + logos dans `src/assets/partenaires/` |
| les mentions légales             | `src/pages/mentions-legales.astro`                   |

Si un fichier est mal rempli (champ obligatoire absent, date au mauvais format…), **le build échoue et
l'ancienne version du site reste en ligne**. Le message d'erreur, avec le fichier et le champ en cause, est
dans Netlify > Deploys > le déploiement en échec > « Deploy log ».

## Événements — `src/content/evenements/*.md`

Le nom du fichier devient l'adresse de la page : `boucles-braconne-2027.md` → `/evenements/boucles-braconne-2027/`.
Minuscules, sans accents ni espaces.

```markdown
---
titre: Les Boucles de la Braconne 2027
type: Randonnée route
date: 2027-03-14                 # AAAA-MM-JJ (sans date : dateTexte est affiché, ex. "[date]")
heure: départs dès 7 h 30        # facultatif
lieu: Salle des fêtes de Brie
resume: Randonnée route · 45 · 80 · 110 km   # une ligne dans la liste du calendrier
phare: true                      # mis en avant en grand en tête du calendrier
badge: Événement phare           # facultatif
affiche: affiche-boucles-2027.jpg   # fichier de src/assets/photos/ (facultatif)
infos:                           # lignes libres, autant qu'on veut
  - label: Tarif
    valeur: 5 € licenciés · 8 € non-licenciés
  - label: Ravitaillements
    valeur: 3 ravitos + pot à l'arrivée
lienInscription: https://…       # facultatif
lienParcours: https://…          # facultatif (lien vers les GPX)
---

Texte libre de la page de l'événement, en Markdown : **gras**, listes, liens…
```

- Sur l'accueil, seuls les événements **à venir** sont affichés, du plus proche au plus lointain (ceux sans
  date à la fin). Le premier événement `phare: true` à venir prend le grand bloc.
- Un événement passé disparaît de l'accueil, mais sa page reste en ligne (marquée « Événement passé »).
- Les données structurées Google (`Event`) ne sont générées que si `date` est renseignée.

### Mise à jour automatique chaque nuit

Le site est statique : un événement passé ne disparaît de l'accueil qu'au build suivant. Le fichier
`.github/workflows/rebuild-quotidien.yml` relance donc un build chaque nuit. Mise en place, à faire une fois :
1. Netlify > Site configuration > Build & deploy > **Build hooks** > « Add build hook » → copier l'URL.
2. GitHub > Settings > Secrets and variables > Actions > « New repository secret » :
   nom `NETLIFY_BUILD_HOOK`, valeur = l'URL.

### Référencement des pages d'événement

Une page d'événement n'est proposée à Google (balise `robots`, sitemap) **que si elle est complète** : une
`date` renseignée et plus aucun texte entre crochets `[...]`, ni dans l'en-tête ni dans le texte. Tant qu'il
reste un `[XX] km`, la page est en ligne et accessible depuis le site, mais en `noindex`, ce qui évite qu'une
page vide de sens soit indexée. Les liens Markdown `[texte](url)` ne comptent pas comme des placeholders.

Pour qu'un événement ressorte bien dans Google :
- `date` et `heure` renseignées (l'heure est lue dans le texte : « 8 h », « départs dès 7 h 30 ») ;
- une `affiche` (elle sert aussi d'image dans les résultats et de miniature sur les réseaux sociaux) ;
- un `resume` qui dit concrètement ce que c'est (distances, public), et quelques phrases dans le corps du fichier.

Tous les événements, passés compris, sont listés sur `/evenements/`.

## Actus — `src/content/actus/*.md`

```markdown
---
titre: Retour sur l'assemblée générale
date: 2026-09-19
resume: Licences, bilan de la saison et présentation des Boucles de la Braconne 2027.
image: affiche-ag.jpg       # fichier de src/assets/photos/ (facultatif)
cadrage: center 35%         # facultatif : partie de la photo à garder visible
lien: https://…             # facultatif : rend le titre cliquable
---
```
Les 3 actus les plus récentes sont affichées sur l'accueil.

## Images

- **Galerie** : toute image déposée dans `src/assets/galerie/` apparaît automatiquement (8 max sur l'accueil).
  Nomme-les en commençant par la date, `2026-10-12-sortie-gravel.jpg` : les plus récentes passent en premier,
  et le texte alternatif est tiré du nom (« Sortie gravel »).
- **Autres images** (`src/assets/photos/`) : `logo.png` et `hero.png` sont attendues sous ces noms exacts.
  Les autres sont appelées par leur nom dans les fichiers de contenu.
- Astro optimise tout au build (WebP, plusieurs tailles). Tu peux envoyer les photos telles quelles, mais
  évite les fichiers de plus de 5 Mo.
- Une image introuvable ne casse pas le build : un bloc hachuré s'affiche à la place, et un avertissement
  apparaît dans le log de build.

## `src/data/*.json`

JSON = guillemets droits `"`, virgule entre les éléments mais pas après le dernier. Une valeur vide `""` ou
entre crochets `"[...]"` est considérée comme à remplir : le lien correspondant n'est pas cliquable.

`club.json` : `telephone`, `contactNom`, `telephonePresident`, `email`, `lieuRdv`, `adresse`, `ville`, `codePostal`,
`latitude` / `longitude` (centre de la carte et données structurées),
`horaireEte`, `horaireHiver`, `facebook`, `instagram` (URL complète).

`partenaires.json` : `[{ "nom": "Vélo Shop", "logo": "velo-shop.png", "lien": "https://…" }]`, avec le logo dans
`src/assets/partenaires/`. Sans logo, le nom s'affiche dans la case. Une liste vide `[]` masque la section.

## Développement local

```bash
npm install
npm run dev       # http://localhost:4321, rechargement à chaud
npm run build     # génère dist/
npm run preview   # sert dist/
```
Il faut Node ≥ 22.22 (`.nvmrc`).

## Mise en ligne sur Netlify (une fois)

1. Pousser ce dossier dans un dépôt GitHub.
2. Netlify > « Add new site » > « Import an existing project » > GitHub > choisir le dépôt.
   Les réglages sont lus dans `netlify.toml` (build `npm run build`, dossier `dist`, Node 22).
3. Brancher le nom de domaine du club (Domain management). Netlify fournit la variable `URL` au build :
   sitemap, `robots.txt` et balises de partage l'utilisent automatiquement.
4. Configurer le build quotidien (voir plus haut).
5. Déclarer le site dans Google Search Console et y soumettre `https://<domaine>/sitemap-index.xml`.
6. Créer la fiche **Google Business Profile** du club (catégorie « Club de cyclisme », adresse de la salle des
   fêtes, lien vers le site) : c'est ce qui fait apparaître le club sur Google Maps et dans « club vélo près de moi ».
7. Après la mise en ligne, tester une page d'événement daté avec l'outil
   [Résultats enrichis de Google](https://search.google.com/test/rich-results).

## Structure

```
src/content.config.ts       schéma des événements et des actus (champs, formats)
src/content/evenements/     un .md par événement
src/content/actus/          un .md par actu
src/data/                   club.json, sorties.json, partenaires.json
src/assets/                 photos/, galerie/, partenaires/
src/lib/site.ts             utilitaires : images, dates, tri du calendrier
src/components/             une section par fichier + Photo (image ou bloc hachuré), Info
src/pages/index.astro       accueil
src/pages/evenements/[id].astro   page de chaque événement
src/pages/evenements/index.astro  archive : tous les événements
src/pages/404.astro               page introuvable
src/lib/placeholders.mjs          règle « texte entre crochets » (noindex + sitemap)
src/pages/mentions-legales.astro
src/pages/robots.txt.ts
src/styles/global.css       couleurs du club, styles, responsive
netlify.toml                configuration Netlify
.github/workflows/rebuild-quotidien.yml
```
