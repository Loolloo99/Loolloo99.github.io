/*
 * ============================================================
 *  DATI DEL SITO
 *  Dati personali e linguaggi.
 *  I testi con { it, en } hanno una versione per lingua.
 *  I progetti sono in src/content/progetti/ (una cartella per progetto).
 * ============================================================
 */

import type { Localized } from "./i18n/ui";

export interface Language {
  /** Chiave da usare nel campo "language" dei progetti */
  id: string;
  name: string;
  ext: string;
  color: string;
  frameworks: string[];
}

export const SITE = {
  name: "Lorenzo Bolzoni",
  initials: "LB",
  role: { it: "Sviluppatore software", en: "Software developer" } as Localized,
  bio: {
    it: "Progetto e sviluppo applicazioni web e servizi backend, dai gestionali in Laravel alle API in FastAPI, fino a soluzioni IoT che collegano dispositivi e sensori al web.",
    en: "I design and build web applications and backend services, from Laravel management systems to FastAPI APIs, all the way to IoT solutions that connect devices and sensors to the web.",
  } as Localized,
  location: { it: "Italia", en: "Italy" } as Localized,
  email: "lollo@bolzo.eu",
  github: "https://github.com/Loolloo99",
  /** Indirizzo completo del profilo LinkedIn, oppure null per nascondere il pulsante */
  linkedin: null as string | null,
  /** File dentro public/ (es. "cv.pdf") oppure null per nascondere il pulsante */
  cv: null as string | null,
  /** Strumenti AI: compaiono nel profilo in alto e nella sezione "Stack". [] per nasconderle */
  ai: ["Claude Code", "Codex"] as string[],
  /** Mostra il badge "Disponibile per nuovi progetti" */
  available: true,
};

/** Linguaggi, in ordine di esperienza */
export const LANGUAGES: Language[] = [
  { id: "php", name: "PHP", ext: ".php", color: "#8993BE", frameworks: ["Laravel"] },
  { id: "js", name: "JavaScript", ext: ".js", color: "#F7DF1E", frameworks: ["React"] },
  { id: "ts", name: "TypeScript", ext: ".ts", color: "#3178C6", frameworks: [] },
  { id: "python", name: "Python", ext: ".py", color: "#5A9FD4", frameworks: ["Django", "FastAPI"] },
  { id: "cobol", name: "COBOL", ext: ".cbl", color: "#3DDC97", frameworks: [] },
  // { id: "java", name: "Java", ext: ".java", color: "#F0883E", frameworks: ["Spring Boot"] },
];

export function getLanguage(id: string): Language {
  const language = LANGUAGES.find((l) => l.id === id);
  if (!language) throw new Error(`Linguaggio "${id}" non presente in LANGUAGES (src/config.ts)`);
  return language;
}
