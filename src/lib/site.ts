import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { contientPlaceholder } from './placeholders.mjs';
import club from '../data/club.json';

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

/**
 * Date ISO 8601 avec l'heure et le fuseau de Paris si l'heure est lisible dans le texte
 * (« 8 h », « départs dès 7 h 30 », « 9h15 ») ; sinon la date seule.
 * Ex. 2027-03-14 + « départs dès 7 h 30 » → 2027-03-14T07:30:00+01:00
 */
export function isoDateHeure(d: Date, heure?: string) {
  const m = heure?.match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  if (!m) return isoDate(d);
  const hh = m[1].padStart(2, '0');
  const mm = m[2] ?? '00';
  // Décalage horaire de Paris ce jour-là (+01:00 en hiver, +02:00 en été)
  const instant = new Date(`${isoDate(d)}T12:00:00Z`);
  const nom = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', timeZoneName: 'longOffset' })
    .formatToParts(instant).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+01:00';
  const decalage = nom.replace('GMT', '') || '+00:00';
  return `${isoDate(d)}T${hh}:${mm}:00${decalage}`;
}

// ---------- Événements ----------

export type Evenement = CollectionEntry<'evenements'>;

/** Aujourd'hui à 0 h UTC : un événement du jour reste affiché toute la journée. */
function aujourdhui() {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

export function estPasse(e: Evenement) {
  return e.data.date ? e.data.date.getTime() < aujourdhui().getTime() : false;
}

/**
 * Une page encore pleine de « [XX] » ne doit pas être indexée par Google (contenu vide de sens).
 * Même règle que le filtre du sitemap dans astro.config.mjs.
 */
export function aIndexer(e: Evenement) {
  // dateTexte vaut « [date] » par défaut : on l'ignore, c'est la vraie date qui compte.
  const { dateTexte: _ignore, ...champs } = e.data;
  return !!e.data.date && !textes(champs).some(contientPlaceholder) && !contientPlaceholder(e.body);
}

// On teste chaque texte séparément : dans un JSON.stringify, les crochets d'un tableau (ex. `infos`)
// passeraient pour un placeholder.
function textes(v: unknown): string[] {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.flatMap(textes);
  if (v && typeof v === 'object' && !(v instanceof Date)) return Object.values(v).flatMap(textes);
  return [];
}

/** Texte court pour les titres et descriptions : « à Brie (Charente) » */
export const localite = `à ${club.ville} (${club.departement})`;

/** Coupe proprement à ~160 caractères pour une meta description. */
export function resumer(texte: string, max = 160) {
  const t = texte.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[ ,;:·–-]+$/, '') + '…';
}

/**
 * Événements à venir (date ≥ aujourd'hui, ou sans date), du plus proche au plus lointain ;
 * les événements sans date sont mis à la fin. Affichés en tête des actus de l'accueil.
 */
export async function evenementsAVenir() {
  const jour = aujourdhui().getTime();
  return (await getCollection('evenements'))
    .filter((e) => !e.data.date || e.data.date.getTime() >= jour)
    .sort((a, b) => (a.data.date?.getTime() ?? Infinity) - (b.data.date?.getTime() ?? Infinity) || a.id.localeCompare(b.id));
}

/** Texte de date d'un événement : « 14 mars 2027 » ou le dateTexte. */
export const dateEvenement = (e: Evenement) => dateLongue(e.data.date, e.data.dateTexte);

// ---------- Actus ----------

/** Une carte de la section « Les actus » : une actu ou un événement, ramenés à la même forme. */
export interface Carte {
  id: string;
  aVenir: boolean;
  titre: string;
  date?: Date;
  dateTexte: string;
  resume?: string;
  image?: ImageMetadata;
  cadrage?: string;
  href?: string;
}

function carteEvenement(e: Evenement, aVenir: boolean): Carte {
  return {
    id: `evenement-${e.id}`,
    aVenir,
    titre: e.data.titre,
    date: e.data.date,
    dateTexte: dateEvenement(e),
    resume: e.data.resume,
    image: photo(e.data.affiche),
    // Les affiches sont en portrait : on garde le haut (titre de l'affiche)
    cadrage: 'center 20%',
    href: `/evenements/${e.id}/`,
  };
}

function carteActu(a: CollectionEntry<'actus'>): Carte {
  return {
    id: `actu-${a.id}`,
    aVenir: false,
    titre: a.data.titre,
    date: a.data.date,
    dateTexte: a.data.date ? dateLongue(a.data.date) : a.data.dateTexte,
    resume: a.data.resume,
    image: photo(a.data.image),
    cadrage: a.data.cadrage,
    href: lien(a.data.lien),
  };
}

/**
 * Fil des actus : d'abord les événements à venir (du plus proche au plus lointain), puis les actus et les
 * événements passés mélangés, du plus récent au plus ancien (les actus sans date à la fin).
 */
export async function filActus(max = Infinity): Promise<Carte[]> {
  const aVenir = (await evenementsAVenir()).map((e) => carteEvenement(e, true));
  const passes = (await getCollection('evenements')).filter(estPasse).map((e) => carteEvenement(e, false));
  const nouvelles = (await getCollection('actus')).map(carteActu);
  const reste = [...passes, ...nouvelles]
    .sort((a, b) => (b.date?.getTime() ?? -Infinity) - (a.date?.getTime() ?? -Infinity) || a.id.localeCompare(b.id));
  return [...aVenir, ...reste].slice(0, max);
}
