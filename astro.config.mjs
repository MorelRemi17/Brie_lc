// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site 100 % statique, construit par Netlify à chaque modification poussée sur GitHub.
// Netlify fournit l'adresse publique du site dans la variable URL au moment du build :
// elle sert au sitemap, aux balises Open Graph et aux données structurées des événements.
export default defineConfig({
  output: 'static',
  site: process.env.URL || 'http://localhost:4321',
  integrations: [sitemap()],
});
