// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // Indirizzo pubblico del sito: serve per URL canonici e anteprime dei link condivisi.
  site: "https://loolloo99.github.io",

  // Solo se il sito sta in una sottocartella, es. https://loolloo99.github.io/portfolio
  // base: "/portfolio",

  trailingSlash: "ignore",

  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
