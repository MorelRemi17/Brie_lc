import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Collections de contenu : un fichier Markdown = une entrée.
 * Le nom du fichier devient l'adresse de la page :
 *   src/content/evenements/boucles-braconne-2027.md → /evenements/boucles-braconne-2027/
 * Si un champ obligatoire manque ou a un mauvais format, le build échoue avec un message
 * qui indique le fichier et le champ (visible dans les logs de déploiement Netlify).
 */

const info = z.object({ label: z.string(), valeur: z.string() });

const evenements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/evenements' }),
  schema: z.object({
    titre: z.string(),
    /** ex. « Sortie gravel », « Randonnée route » */
    type: z.string(),
    /** AAAA-MM-JJ. Sans date, l'événement est affiché avec dateTexte (ex. « [date] »). */
    date: z.coerce.date().optional(),
    dateTexte: z.string().default('[date]'),
    /** ex. « 8 h », « départs dès 7 h 30 » */
    heure: z.string().optional(),
    lieu: z.string(),
    /** Une ligne affichée dans la liste du calendrier */
    resume: z.string().optional(),
    /** true = mis en avant en grand en tête du calendrier (le plus proche des événements « phare ») */
    phare: z.boolean().default(false),
    badge: z.string().default('Événement phare'),
    /** Nom d'un fichier de src/assets/photos/ */
    affiche: z.string().optional(),
    /** Lignes libres « label : valeur » (tarif, parcours, ravitos…) */
    infos: z.array(info).default([]),
    lienInscription: z.string().optional(),
    lienParcours: z.string().optional(),
  }),
});

const actus = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actus' }),
  schema: z.object({
    titre: z.string(),
    /** AAAA-MM-JJ ; sert aussi au tri (la plus récente en premier) */
    date: z.coerce.date().optional(),
    dateTexte: z.string().default('[date]'),
    resume: z.string(),
    /** Nom d'un fichier de src/assets/photos/ */
    image: z.string().optional(),
    /** Partie de la photo à garder visible (CSS object-position), ex. « center 35% » */
    cadrage: z.string().optional(),
    lien: z.string().optional(),
  }),
});

export const collections = { evenements, actus };
