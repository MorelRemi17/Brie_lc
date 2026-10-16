# Contenus à fournir

## Avant tout : les 3 images de la maquette

L'outil d'import Claude Design limite les fichiers à 256 Kio : les images n'ont pas pu être récupérées
automatiquement. À exporter depuis claude.ai/design (projet « Site Brie LC », dossier `assets/`) :

- [ ] `src/assets/photos/logo.png` — logo du club (header, favicon). En attendant : « Brie L.C. » en texte.
- [ ] `src/assets/photos/hero.png` — photo du bandeau d'accueil (et image de partage sur les réseaux)
- [ ] `src/assets/photos/affiche-ag.jpg` — affiche de l'AG (actu du 19/09/2026)
- [ ] (facultatif) copier aussi `hero.png` dans `src/assets/galerie/`, sous un nom comme
      `2026-09-01-sortie-club.png`, si tu veux la retrouver en 1re photo de la galerie comme sur la maquette

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
      l'association, siège, RNA, SIRET, affiliation, directeur de la publication, adresse de Netlify,
      crédits photos, date de mise à jour

## Autres
- [ ] Netlify : build hook + secret GitHub `NETLIFY_BUILD_HOOK` (voir README)
