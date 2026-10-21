# Contenus à fournir

## Images
- [x] `logo.png`, `hero.png`, `affiche-ag.jpg` déposées dans `src/assets/photos/` (16/10/2026)
- [ ] **Photo du hero en meilleure résolution** : `hero.png` ne fait que 760 × 380 px et paraît floue en plein
      écran. Idéalement 2400 px de large au moins, en JPG (la photo d'origine plutôt que l'export de la maquette).
      Il suffit de remplacer `src/assets/photos/hero.png`, ou de déposer `hero.jpg` et de changer le nom
      dans `src/components/Hero.astro` et `src/layouts/Base.astro`.
- [ ] (facultatif) copier aussi la photo du hero dans `src/assets/galerie/`, sous un nom comme
      `2026-09-01-sortie-club.jpg`, pour la retrouver en 1re photo de la galerie comme sur la maquette

## `src/data/club.json`
- [ ] `telephone` : `[06 XX XX XX XX]`
- [ ] `contactNom` : `[Prénom Nom]`
- [ ] `telephonePresident` : `[téléphone du président]`
- [ ] `email` : `[email du club]`
- [ ] `facebook`, `instagram` : URL (vides aujourd'hui)

## `src/content/evenements/`
- [ ] `boucles-braconne-2027.md` : `date` (à décommenter), heure, tarif, distances, ravitos, affiche,
      liens d'inscription et de parcours, texte de présentation
- [ ] `sortie-gravel.md` : date, distance, description
- [ ] `sortie-vtt.md` : date, lieu, distance, description

## `src/content/actus/`
- [ ] `horaire-hiver.md` : date, texte, photo
- [ ] `actu-3.md` : à remplacer par une vraie actu (ou à supprimer)

## Galerie / partenaires
- [ ] Photos de sorties dans `src/assets/galerie/`
- [ ] 6 partenaires dans `src/data/partenaires.json` + logos dans `src/assets/partenaires/`

## `src/pages/mentions-legales.astro`
- [ ] Compléter tous les `[...]` (voir les questions posées dans la conversation) : nom complet de
      l'association, siège, RNA, SIRET, affiliation, directeur de la publication,
      crédits photos, date de mise à jour

## Autres
- [x] Google Search Console : propriété `https://brielc.netlify.app/` validée, sitemap récupéré par Google (16/10/2026)
- [ ] Fiche Google Business Profile du club
