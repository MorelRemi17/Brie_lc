import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

// ---------- Valeurs « à remplir » ----------

/** Vrai si la valeur est vide ou encore un placeholder « [..] ». */
export function aRemplir(v: unknown): boolean {
  const s = v == null ? '' : String(v).trim();
  return s === '' || /^\[.*\]$/.test(s);
}

/** Lien cliquable seulement s'il est renseigné. */
export function lien(v?: string): string | undefined {
  return aRemplir(v) ? undefined : v;
}

/** Attributs pour un lien externe (nouvel onglet). */
export function externe(href?: string) {
  return href && /^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener' } : {};
}

export function telHref(v?: string) {
  return aRemplir(v) ? undefined : 'tel:' + String(v).replace(/[^\d+]/g, '');
}

export function mailHref(v?: string) {
  return aRemplir(v) ? undefined : 'mailto:' + String(v).trim();
}

// ---------- Images ----------
// Les images sont lues dans src/assets/ au build : Astro les optimise (WebP, tailles adaptées).
// Une image absente ne casse pas le build : on affiche un bloc hachuré à la place.

type Module = { default: ImageMetadata };
const photos = import.meta.glob<Module>('/src/assets/photos/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP}', { eager: true });
const logos = import.meta.glob<Module>('/src/assets/partenaires/*.{png,jpg,jpeg,webp,avif,svg,PNG,JPG,JPEG,WEBP,SVG}', { eager: true });
const galerie = import.meta.glob<Module>('/src/assets/galerie/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP}', { eager: true });

const dejaSignale = new Set<string>();

function chercher(table: Record<string, Module>, dossier: string, nom?: string): ImageMetadata | undefined {
  if (aRemplir(nom)) return undefined;
  const cle = `/src/assets/${dossier}/${nom}`;
  const m = table[cle];
  if (!m && !dejaSignale.has(cle) && dejaSignale.add(cle)) console.warn(`[images] « ${nom} » introuvable dans src/assets/${dossier}/ — bloc hachuré affiché à la place.`);
  return m?.default;
}

/** Image de src/assets/photos/ par son nom de fichier. */
export const photo = (nom?: string) => chercher(photos, 'photos', nom);

/** Logo de src/assets/partenaires/ par son nom de fichier. */
export const logoPartenaire = (nom?: string) => chercher(logos, 'partenaires', nom);

/** Toutes les photos de src/assets/galerie/, les plus récentes d'abord (tri sur le nom). */
export function photosGalerie(): { src: ImageMetadata; alt: string }[] {
  return Object.entries(galerie)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([chemin, m]) => {
      const nom = chemin.split('/').pop()!.replace(/\.[^.]+$/, '');
      const sansDate = nom.replace(/^\d{4}-\d{2}-\d{2}[-_ ]?/, '').replace(/[-_]+/g, ' ').trim();
      return { src: m.default, alt: sansDate ? sansDate.charAt(0).toUpperCase() + sansDate.slice(1) : 'Sortie du club' };
    });
}

/** Largeurs du srcset : celles demandées qui sont plus petites que l'image, plus la plus grande possible. */
export function largeurs(img: ImageMetadata, voulues: number[]) {
  return [...new Set([...voulues.filter((w) => w < img.width), Math.min(img.width, Math.max(...voulues))])];
}

// ---------- Dates ----------
// Les dates des fichiers (AAAA-MM-JJ) sont lues en UTC : on formate donc en UTC.

const fmtLong = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const fmtCourt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmtJour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const dateLongue = (d?: Date, defaut = '[date]') => (d ? fmtLong.format(d) : defaut);
export const dateCourte = (d?: Date, defaut = '[date]') => (d ? fmtCourt.format(d) : defaut);
export const dateJour = (d?: Date, defaut = '[date]') => (d ? fmtJour.format(d) : defaut);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

// ---------- Événements ----------

export type Evenement = CollectionEntry<'evenements'>;

/** Aujourd'hui à 0 h UTC : un événement du jour reste affiché toute la journée. */
function aujourdhui() {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

/**
 * Événements à venir (date ≥ aujourd'hui, ou sans date), du plus proche au plus lointain ;
 * les événements sans date sont mis à la fin. Le premier événement « phare » est séparé du reste.
 */
export async function calendrier() {
  const jour = aujourdhui().getTime();
  const aVenir = (await getCollection('evenements'))
    .filter((e) => !e.data.date || e.data.date.getTime() >= jour)
    .sort((a, b) => (a.data.date?.getTime() ?? Infinity) - (b.data.date?.getTime() ?? Infinity) || a.id.localeCompare(b.id));
  const phare = aVenir.find((e) => e.data.phare);
  return { phare, liste: aVenir.filter((e) => e !== phare) };
}

/** Texte de date d'un événement : « 14 mars 2027 » ou le dateTexte. */
export const dateEvenement = (e: Evenement) => dateLongue(e.data.date, e.data.dateTexte);

// ---------- Actus ----------

/** Actus datées de la plus récente à la plus ancienne, puis les actus sans date. */
export async function actus(max = 3) {
  return (await getCollection('actus'))
    .sort((a, b) => (b.data.date?.getTime() ?? -Infinity) - (a.data.date?.getTime() ?? -Infinity) || a.id.localeCompare(b.id))
    .slice(0, max);
}
