const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Percorso interno che rispetta l'eventuale `base` di astro.config.mjs */
export const url = (path = "") => `${base}/${path.replace(/^\//, "")}`;
