/*
 * ============================================================
 *  LINGUE DEL SITO
 *  L'italiano è la lingua principale (indirizzi senza prefisso: /, /progetti/...),
 *  l'inglese sta sotto /en/ (/en/, /en/projects/...).
 *  Qui ci sono i testi dell'interfaccia; i testi personali sono in src/config.ts,
 *  le traduzioni dei progetti in index.en.md accanto a ogni index.md.
 * ============================================================
 */

import { url } from "../lib/url";

export const LOCALES = ["it", "en"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "it";

/** Testo con una versione per lingua */
export type Localized = Record<Lang, string>;

export const LANG_NAMES: Record<Lang, { short: string; name: string; locale: string }> = {
  it: { short: "IT", name: "Italiano", locale: "it_IT" },
  en: { short: "EN", name: "English", locale: "en_US" },
};

const it = {
  "nav.sections": "Sezioni",
  "nav.stack": "Stack",
  "nav.projects": "Progetti",
  "nav.contact": "Contatti",
  "nav.skip": "Vai al contenuto",
  "nav.inspect": "Modalità inspect code",
  "nav.inspectTitle": "Inspect code (tasto I)",
  "nav.readIn": "Leggi in italiano",
  "phosphor.amber": "Ambra",
  "phosphor.green": "Verde",
  "phosphor.toAmber": "Passa al fosforo ambra",
  "phosphor.toGreen": "Passa al fosforo verde",
  "footer.top": "Torna su ^",
  "footer.ai": "Portfolio e media illustrativi realizzati con l'aiuto dell'AI",

  "inspect.active": "Inspect code attivo",
  "inspect.lens": "lente",
  "inspect.exit": "Esci",
  "inspect.version": "versione",

  "home.available": "Disponibile per nuovi progetti",
  "home.seeProjects": "Vedi i progetti",
  "home.cv": "Curriculum",
  "home.stackLead": "Linguaggi e framework in ordine di esperienza, più gli strumenti AI che uso ogni giorno.",
  "home.noProjects": "nessun progetto",
  "home.aiTools": "Strumenti AI",
  "home.aiUse": "uso quotidiano",
  "home.projectsLead": "Divisi per linguaggio. Apri un progetto per screenshot, descrizione completa e link al codice.",
  "home.empty": "Nessun progetto ancora: aggiungili in",
  "home.all": "Tutti",
  "home.languages": "Linguaggi",
  "home.only": "Solo",
  "home.filterBy": "Filtra i progetti {lang} per framework",
  "home.contactTitle": "Hai un progetto in mente?",
  "home.contactLead": "Scrivimi per collaborazioni, proposte di lavoro o anche solo per parlare di codice.",
  "project.one": "progetto",
  "project.many": "progetti",

  "card.screenshot": "Screenshot di {title}",
  "card.code": "Codice",
  "card.private": "Codice privato",
  "card.open": "Apri",

  "project.back": "Progetti {lang}",
  "project.github": "Vedi su GitHub",
  "project.demo": "Demo online",
  "project.notPublic": "Codice non pubblico",
  "project.video": "Video dimostrativo di {title}",
  "project.shotN": "Screenshot {n} di {title}",
  "project.sheet": "Scheda del progetto",
  "project.language": "linguaggio",
  "project.languages": "linguaggi",
  "project.tags": "tecnologie",
  "project.year": "anno",
  "project.code": "codice",
  "project.notPublicShort": "Non pubblico",
  "project.moreShots": "Altri screenshot",
  "gallery.viewer": "Visore immagini",
  "gallery.open": "Apri a piena grandezza",
  "gallery.close": "Chiudi",
  "gallery.prev": "Immagine precedente",
  "gallery.next": "Immagine successiva",
  "gallery.position": "Immagine {n} di {tot}",
  "project.others": "Altri progetti",
  "project.prev": "precedente",
  "project.next": "successivo",
  "project.untranslated": "Questo progetto non è ancora tradotto in italiano.",

  "notfound.title": "Pagina non trovata",
  "notfound.lead": "La pagina che cerchi non esiste o è stata spostata.",
  "notfound.home": "Torna alla home",

  "code.file": "profilo.json",
  "code.role": "ruolo",
  "code.location": "sede",
  "code.languages": "linguaggi",
  "code.projects": "progetti",
};

export type UiKey = keyof typeof it;

const en: Record<UiKey, string> = {
  "nav.sections": "Sections",
  "nav.stack": "Stack",
  "nav.projects": "Projects",
  "nav.contact": "Contact",
  "nav.skip": "Skip to content",
  "nav.inspect": "Inspect code mode",
  "nav.inspectTitle": "Inspect code (I key)",
  "nav.readIn": "Read in English",
  "phosphor.amber": "Amber",
  "phosphor.green": "Green",
  "phosphor.toAmber": "Switch to amber phosphor",
  "phosphor.toGreen": "Switch to green phosphor",
  "footer.top": "Back to top ^",
  "footer.ai": "Portfolio and illustrative media made with AI assistance",

  "inspect.active": "Inspect code on",
  "inspect.lens": "lens",
  "inspect.exit": "Exit",
  "inspect.version": "as",

  "home.available": "Available for new projects",
  "home.seeProjects": "See projects",
  "home.cv": "Résumé",
  "home.stackLead": "Languages and frameworks by experience, plus the AI tools I use every day.",
  "home.noProjects": "no projects",
  "home.aiTools": "AI tools",
  "home.aiUse": "daily use",
  "home.projectsLead": "Grouped by language. Open a project for screenshots, the full description and a link to the code.",
  "home.empty": "No projects yet: add them in",
  "home.all": "All",
  "home.languages": "Languages",
  "home.only": "Only",
  "home.filterBy": "Filter {lang} projects by framework",
  "home.contactTitle": "Got a project in mind?",
  "home.contactLead": "Write to me about collaborations, job offers or just to talk about code.",
  "project.one": "project",
  "project.many": "projects",

  "card.screenshot": "Screenshot of {title}",
  "card.code": "Code",
  "card.private": "Private code",
  "card.open": "Open",

  "project.back": "{lang} projects",
  "project.github": "View on GitHub",
  "project.demo": "Live demo",
  "project.notPublic": "Code not public",
  "project.video": "Demo video of {title}",
  "project.shotN": "Screenshot {n} of {title}",
  "project.sheet": "Project details",
  "project.language": "language",
  "project.languages": "languages",
  "project.tags": "technologies",
  "project.year": "year",
  "project.code": "code",
  "project.notPublicShort": "Not public",
  "project.moreShots": "More screenshots",
  "gallery.viewer": "Image viewer",
  "gallery.open": "Open full size",
  "gallery.close": "Close",
  "gallery.prev": "Previous image",
  "gallery.next": "Next image",
  "gallery.position": "Image {n} of {tot}",
  "project.others": "Other projects",
  "project.prev": "previous",
  "project.next": "next",
  "project.untranslated": "This project has not been translated into English yet; the description below is in Italian.",

  "notfound.title": "Page not found",
  "notfound.lead": "The page you are looking for does not exist or has been moved.",
  "notfound.home": "Back to home",

  "code.file": "profile.json",
  "code.role": "role",
  "code.location": "location",
  "code.languages": "languages",
  "code.projects": "projects",
};

const UI: Record<Lang, Record<UiKey, string>> = { it, en };

/** Traduttore per una lingua: t("home.filterBy", { lang: "PHP" }) */
export function useTranslations(lang: Lang) {
  return (key: UiKey, vars: Record<string, string | number> = {}) =>
    UI[lang][key].replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

/** "1 progetto", "3 projects" */
export const countProjects = (lang: Lang, n: number) =>
  `${n} ${useTranslations(lang)(n === 1 ? "project.one" : "project.many")}`;

/** Percorso interno nella lingua indicata: localeUrl("en", "#stack") → /en/#stack */
export const localeUrl = (lang: Lang, path = "") => url(lang === DEFAULT_LANG ? path : `${lang}/${path.replace(/^\//, "")}`);

