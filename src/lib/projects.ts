import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { LANGUAGES } from "../config";
import { DEFAULT_LANG, localeUrl, type Lang } from "../i18n/ui";

type Entry = CollectionEntry<"progetti">;

/** Progetto in una lingua: i dati di index.md con titolo, descrizione e corpo tradotti se c'è index.en.md */
export interface Project {
  id: string;
  lang: Lang;
  data: Entry["data"];
  body?: string;
  /** Voce da passare a render() per il corpo in Markdown */
  entry: Entry | CollectionEntry<"progettiEn">;
  /** false = manca la traduzione e i testi sono in italiano */
  translated: boolean;
}

/** Linguaggio principale del progetto: il primo di `languages` */
export const primaryLanguage = (project: Project) => project.data.languages[0];

async function localize(entry: Entry, lang: Lang): Promise<Project> {
  const translation = lang === "en" ? await getEntry("progettiEn", entry.id) : undefined;
  const source = translation ?? entry;
  return {
    id: entry.id,
    lang,
    data: translation
      ? { ...entry.data, ...translation.data, video: translation.data.video ?? entry.data.video }
      : entry.data,
    body: source.body,
    entry: source,
    translated: lang === DEFAULT_LANG || Boolean(translation),
  };
}

/** Progetti pubblicati, ordinati per linguaggio principale (ordine di esperienza) e poi dal più recente */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection("progetti", ({ data }) => !data.draft);
  const projects = await Promise.all(entries.map((entry) => localize(entry, lang)));
  const rank = (id: string) => LANGUAGES.findIndex((l) => l.id === id);
  return projects.sort(
    (a, b) =>
      rank(primaryLanguage(a)) - rank(primaryLanguage(b)) ||
      (b.data.year ?? 0) - (a.data.year ?? 0) ||
      a.data.title.localeCompare(b.data.title, lang),
  );
}

/** Segmento degli indirizzi dei progetti in ogni lingua */
export const PROJECTS_PATH: Record<Lang, string> = { it: "progetti", en: "projects" };

export const projectPath = (id: string, lang: Lang) => localeUrl(lang, `${PROJECTS_PATH[lang]}/${id}/`);
export const projectUrl = (project: Project) => projectPath(project.id, project.lang);
