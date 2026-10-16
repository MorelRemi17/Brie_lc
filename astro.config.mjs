// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { contientPlaceholder } from './src/lib/placeholders.mjs';

// Pages d'événement exclues du sitemap : sans date, ou encore pleines de « [XX] ».
// Même règle que aIndexer() (src/lib/site.ts), qui met ces pages en « noindex ».
const DOSSIER = './src/content/evenements';
const nonIndexees = new Set(
  readdirSync(DOSSIER)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => {
      const texte = readFileSync(`${DOSSIER}/${f}`, 'utf8');
      const aUneDate = /^date:\s*\d{4}-\d{2}-\d{2}/m.test(texte);
      return !aUneDate || contientPlaceholder(texte);
    })
    .map((f) => `/evenements/${f.replace(/\.md$/, '')}/`)
);

// Site 100 % statique, construit par Netlify à chaque modification poussée sur GitHub.
// Netlify fournit l'adresse publique du site dans la variable URL au moment du build :
// elle sert au sitemap, aux balises Open Graph et aux données structurées des événements.
export default defineConfig({
  output: 'static',
  site: process.env.URL || 'http://localhost:4321',
  // Une seule forme d'URL (/evenements/x/) : évite les doublons pour Google.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !nonIndexees.has(new URL(page).pathname),
    }),
  ],
});
