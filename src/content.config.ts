import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { LANGUAGES } from "./config";

const languageIds = LANGUAGES.map((l) => l.id) as [string, ...string[]];

/*
 * Un progetto = una cartella in src/content/progetti/ con dentro index.md
 * e gli eventuali screenshot. Il nome della cartella diventa l'indirizzo
 * della pagina: progetti/ocr-fatture/ → /progetti/ocr-fatture/
 */
const progetti = defineCollection({
  loader: glob({
    base: "./src/content/progetti",
    pattern: "*/index.md",
    generateId: ({ entry }) => entry.split(/[\\/]/)[0],
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** id dei linguaggi definiti in src/config.ts; il primo è il principale */
        languages: z.array(z.enum(languageIds)).min(1).optional(),
        /** in alternativa a `languages`, per i progetti con un solo linguaggio */
        language: z.enum(languageIds).optional(),
        frameworks: z.array(z.string()).default([]),
        /** altre tecnologie: database, librerie, tool... */
        tags: z.array(z.string()).default([]),
        year: z.number().int().optional(),
        /** descrizione breve, mostrata nella card */
        summary: z.string(),
        /** percorsi relativi alla cartella del progetto, es. ./home.png; il primo è la copertina */
        screenshots: z.array(image()).default([]),
        /**
         * video in public/, es. progetti/mio-progetto/demo.mp4: prende il posto della copertina, che ne diventa il poster.
         * Più formati in ordine di preferenza, es. [progetti/mio-progetto/demo.webm, progetti/mio-progetto/demo.mp4]
         */
        video: z
          .union([z.string(), z.array(z.string()).min(1)])
          .nullable()
          .default(null)
          .transform((v) => (typeof v === "string" ? [v] : v)),
        github: z.url().nullable().default(null),
        demo: z.url().nullable().default(null),
        /** true = progetto nascosto dal sito */
        draft: z.boolean().default(false),
      })
      .refine((data) => Boolean(data.languages) !== Boolean(data.language), {
        message: "Indica `languages` (es. [php, js]) oppure `language`, non entrambi",
        path: ["languages"],
      })
      .transform(({ language, languages, ...data }) => ({
        ...data,
        languages: [...new Set(languages ?? (language ? [language] : []))],
      })),
});

/*
 * Traduzione inglese di un progetto: index.en.md nella stessa cartella di index.md.
 * Contiene solo i testi (titolo, descrizione breve e corpo) e l'eventuale video tradotto; il resto arriva da index.md.
 * Se manca, la versione inglese del sito mostra il testo italiano.
 */
const progettiEn = defineCollection({
  loader: glob({
    base: "./src/content/progetti",
    pattern: "*/index.en.md",
    generateId: ({ entry }) => entry.split(/[\\/]/)[0],
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    /** video in inglese, stesso formato di `video` in index.md; se manca si usa quello italiano */
    video: z
      .union([z.string(), z.array(z.string()).min(1)])
      .optional()
      .transform((v) => (typeof v === "string" ? [v] : v)),
  }),
});

export const collections = { progetti, progettiEn };
