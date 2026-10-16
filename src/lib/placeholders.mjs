// Partagé par astro.config.mjs (sitemap) et les pages (meta robots).
// Un placeholder est un texte entre crochets, par ex. « [date] » ou « [XX] km ».
// Les liens Markdown « [texte](url) » ne comptent pas (crochet fermant suivi de « ( »).
export const PLACEHOLDER = /\[[^\]\n]+\](?!\()/;

/** Vrai si le texte contient encore un placeholder. */
export function contientPlaceholder(texte) {
  return PLACEHOLDER.test(String(texte ?? ''));
}
