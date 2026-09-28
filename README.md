# Portfolio

Sito statico realizzato con [Astro](https://astro.build).

## Comandi

| Comando           | Cosa fa                                          |
| ----------------- | ------------------------------------------------ |
| `npm install`     | Installa le dipendenze (solo la prima volta)     |
| `npm run dev`     | Sito in sviluppo su http://localhost:4321        |
| `npm run build`   | Genera il sito pronto da pubblicare in `dist/`   |
| `npm run preview` | Mostra in locale il risultato della build        |

## Dove si modificano i contenuti

- **Dati personali e linguaggi:** `src/config.ts`
- **Testi dell'interfaccia (IT/EN):** `src/i18n/ui.ts`
- **Progetti:** `src/content/progetti/` (una cartella per progetto)

## Aggiungere un progetto

1. Crea una cartella in `src/content/progetti/`, es. `mio-progetto/`.
   Il nome della cartella diventa l'indirizzo della pagina: `/progetti/mio-progetto/`.
2. Copia gli screenshot nella stessa cartella.
3. Crea `index.md`:

```markdown
---
title: Mio Progetto
languages: [php, js]     # id da src/config.ts (php, js, ts, python, cobol); il primo è il principale
frameworks: [Laravel, React]
tags: [MySQL, Redis]
year: 2026
summary: Descrizione breve che compare nella card.
screenshots: [./home.png, ./dettaglio.png]   # il primo è la copertina
github: https://github.com/tuo-utente/mio-progetto   # oppure null se privato
demo: null
video: null              # es. progetti/mio-progetto/demo.mp4 dentro public/: sostituisce la copertina, che diventa il poster
                         # più formati: [progetti/mio-progetto/demo.webm, progetti/mio-progetto/demo.mp4] (il browser usa il primo che supporta)
draft: false             # true per nasconderlo
---

Descrizione completa in Markdown: paragrafi, elenchi, **grassetto**, blocchi di codice...
```

Se un linguaggio non esiste o manca un campo obbligatorio, `npm run build` si ferma e indica il file con l'errore.

**Progetti con più linguaggi** (es. Laravel + React): il primo di `languages` è il principale. Nella vista "Tutti" il progetto compare una volta sola, nel gruppo del linguaggio principale; nelle schede dei singoli linguaggi compare in ciascuno. Il linguaggio principale decide anche colore, anteprima generata e dialetto della lente. Per i progetti con un solo linguaggio va bene anche `language: php`.
Se un progetto non ha screenshot, il sito mostra un'anteprima in stile editor generata automaticamente.

## Lingue (italiano e inglese)

Il sito è in italiano su `/` e in inglese su `/en/` (i progetti su `/progetti/<nome>/` e `/en/projects/<nome>/`). Nella barra, `[F4]` (o il tasto F4) apre la stessa pagina nell'altra lingua.

- **Testi dell'interfaccia:** `src/i18n/ui.ts`
- **Ruolo, bio e sede:** `src/config.ts`, nella forma `{ it: "...", en: "..." }`
- **Progetti:** accanto a `index.md` crea `index.en.md` con solo i testi tradotti:

```markdown
---
title: My Project
summary: Short description shown on the card.
---

Full description in English...
```

Se il video ha una versione inglese, aggiungi anche `video: progetti/mio-progetto/demo.en.mp4`: senza, la pagina inglese usa il video italiano.

Tutto il resto (linguaggi, screenshot, link...) arriva da `index.md`. Se `index.en.md` manca, la pagina inglese mostra il testo italiano con un avviso.

## Modalità inspect code

Il pulsante con la lente nella barra (o il tasto `I`) trasforma il cursore in una lente che mostra il markup HTML sotto la pagina; `Esc` per uscire. Sotto la lente compare il file sorgente dell'elemento, preso dall'attributo `data-inspect` dei componenti. Su dispositivi touch il pulsante è nascosto.

Nelle pagine progetto la lente mostra invece la pagina come sarebbe scritta nel template del framework del progetto, con i dati come variabili: Blade (Laravel), JSX (React), template Django, Jinja2 (FastAPI), Thymeleaf (Spring Boot), SCREEN SECTION (COBOL). È codice illustrativo, non il sorgente reale. Il dialetto si sceglie in `src/lib/inspect/dialects.ts`; gli attributi `data-bind`, `data-each`, `data-if` in `src/pages/progetti/[id].astro` collegano gli elementi ai dati.

## Pubblicazione

Il sito è online su **https://loolloo99.github.io** ed è pubblicato da GitHub Pages.

Non serve compilare né caricare niente a mano: a ogni `push` sul branch `main`, il workflow
`.github/workflows/deploy.yml` installa le dipendenze, esegue `npm run build` e pubblica `dist/`.
Il deploy si può lanciare anche a mano dalla tab **Actions** di GitHub.

```bash
git add -A && git commit -m "Aggiorno i contenuti" && git push
```

Lo stato della pubblicazione si vede nella tab **Actions**: circa un minuto dalla push alla
pagina aggiornata.

### Impostazione iniziale su GitHub

1. Crea la repo **pubblica** `Loolloo99.github.io` (il nome deve coincidere con l'utente:
   è così che GitHub la serve alla radice del dominio).
2. `git push` di questo progetto sul branch `main`.
3. Su GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Cambiare indirizzo

L'indirizzo è dichiarato in `astro.config.mjs` e serve per i link canonici e le anteprime
condivise su LinkedIn, WhatsApp e simili:

- `site` è l'indirizzo definitivo del sito;
- `base` va impostato **solo** se il sito sta in una sottocartella
  (es. repo `portfolio` → `site: "https://loolloo99.github.io"`, `base: "/portfolio"`).

Per un dominio personale: metti il dominio in `site`, crea `public/CNAME` con dentro il solo
dominio, e dal registrar aggiungi i record DNS indicati in **Settings → Pages → Custom domain**.

## Licenza

Il codice è distribuito con licenza MIT (vedi `LICENSE`). I contenuti personali — testi dei
progetti, screenshot, video e dati di contatto — non sono coperti dalla licenza e restano
riservati.
