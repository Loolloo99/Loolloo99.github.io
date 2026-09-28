# Portfolio

Il mio portfolio: un terminale a fosfori ambra dove ogni progetto è una scheda, e una lente
che mostra il codice sotto la pagina. Sito statico con [Astro](https://astro.build), senza
framework lato client.

**→ [loolloo99.github.io](https://loolloo99.github.io)**

## Com'è fatto

### I progetti sono contenuto, non codice

Un progetto è una cartella in `src/content/progetti/` con dentro un `index.md` e i suoi
screenshot. Il nome della cartella diventa l'indirizzo della pagina. Nessun componente da
scrivere, nessun elenco da tenere aggiornato a mano.

Il frontmatter passa da uno schema Zod ([`src/content.config.ts`](src/content.config.ts)), e
lo schema è severo apposta: se scrivi un id di linguaggio che non esiste in `src/config.ts`,
se dimentichi il sommario o se indichi sia `language` che `languages`, **`npm run build` si
ferma** e dice quale file e quale campo. Un errore di battitura non arriva in produzione come
una pagina vuota.

Gli screenshot sono dichiarati con `image()`, quindi entrano nell'ottimizzatore di Astro: da
un PNG grande escono WebP in più misure, senza fare niente.

### Due lingue, una sola copia dei dati

Italiano su `/`, inglese su `/en/`. Un progetto si traduce mettendo un `index.en.md` accanto
all'`index.md`, con dentro **solo** titolo, sommario e corpo: linguaggi, screenshot, anno e
link restano dichiarati una volta sola nella versione italiana e vengono uniti al momento
della build ([`src/lib/projects.ts`](src/lib/projects.ts)).

Se la traduzione manca, la pagina inglese esiste lo stesso: mostra il testo italiano con un
avviso. Nessuna pagina che sparisce perché qualcuno non ha finito di tradurre. Nella barra,
`[F4]` apre la stessa pagina nell'altra lingua.

### La lente

Il pulsante con la lente nella barra, o il tasto `I`, trasforma il cursore in una finestrella
che mostra il markup dell'elemento sotto il puntatore, con il file sorgente che lo genera.

Nelle pagine progetto però non mostra HTML: mostra **come quella stessa pagina sarebbe scritta
nel framework del progetto che stai guardando**. Un progetto Laravel te la fa vedere in Blade,
uno React in JSX, uno Django in template Django, uno COBOL in `SCREEN SECTION`. Nove dialetti,
in [`src/lib/inspect/dialects.ts`](src/lib/inspect/dialects.ts).

Non è un'immagine né un testo scritto a mano: gli elementi della pagina portano `data-bind`,
`data-each`, `data-if`, e [`serialize.ts`](src/lib/inspect/serialize.ts) li ricostruisce nel
dialetto scelto rimettendo i dati veri del progetto al posto delle variabili. Il codice esiste
per la lente — non è il sorgente del sito, è la stessa pagina riscritta altrove.

### Altri dettagli

- Un progetto senza screenshot non resta senza copertina: se ne genera una in stile editor,
  con il codice evidenziato ([`src/lib/code.ts`](src/lib/code.ts)).
- La favicon nasce dalle iniziali, come SVG in un data URI: cambi nome in `src/config.ts` e
  cambia anche lei, senza file da rigenerare.
- I blocchi di codice nel Markdown passano da Shiki, con tema chiaro e scuro.

## Comandi

| Comando           | Cosa fa                                          |
| ----------------- | ------------------------------------------------ |
| `npm install`     | Installa le dipendenze (solo la prima volta)     |
| `npm run dev`     | Sito in sviluppo su http://localhost:4321        |
| `npm run build`   | Genera il sito pronto da pubblicare in `dist/`   |
| `npm run preview` | Mostra in locale il risultato della build        |

## Aggiungere un progetto

1. Crea una cartella in `src/content/progetti/`, es. `mio-progetto/` → `/progetti/mio-progetto/`.
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
draft: false             # true per tenerlo fuori dal sito
---

Descrizione completa in Markdown: paragrafi, elenchi, **grassetto**, blocchi di codice...
```

**Progetti con più linguaggi** (es. Laravel + React): il primo di `languages` è il principale.
Nella vista "Tutti" il progetto compare una volta sola, nel gruppo del principale; nelle schede
dei singoli linguaggi compare in ciascuno. Il principale decide anche colore, anteprima generata
e dialetto della lente. Con un linguaggio solo va bene anche `language: php`.

> `draft: true` tiene il progetto fuori dal **sito compilato**, non fuori dalla repo: il
> Markdown resta qui e chiunque può leggerlo su GitHub. Per qualcosa che non deve vedere
> nessuno, tienilo fuori dalla cartella.

### La traduzione inglese

Accanto a `index.md`, un `index.en.md` con i soli testi tradotti:

```markdown
---
title: My Project
summary: Short description shown on the card.
---

Full description in English...
```

Se il video ha una versione inglese aggiungi anche `video: progetti/mio-progetto/demo.en.mp4`;
senza, la pagina inglese usa quello italiano.

## Dove si modifica il resto

- **Dati personali e linguaggi:** `src/config.ts` — i testi per lingua nella forma `{ it, en }`
- **Testi dell'interfaccia:** `src/i18n/ui.ts`

## Pubblicazione

Online su **https://loolloo99.github.io**, da GitHub Pages. A ogni `push` su `main` il workflow
[`deploy.yml`](.github/workflows/deploy.yml) installa, compila e pubblica `dist/`: circa un
minuto dalla push alla pagina aggiornata, lo stato si vede nella tab **Actions**. Si può anche
lanciare a mano da lì.

L'indirizzo è in `astro.config.mjs`, e serve per i link canonici e le anteprime condivise:
`site` è l'indirizzo definitivo, `base` va messo solo se il sito sta in una sottocartella. Per
un dominio personale: dominio in `site`, `public/CNAME` con dentro il solo dominio, e i record
DNS indicati in **Settings → Pages → Custom domain**.

## Licenza

Il codice è distribuito con licenza MIT (vedi [`LICENSE`](LICENSE)). I contenuti personali —
testi dei progetti, screenshot, video e dati di contatto — non sono coperti dalla licenza e
restano riservati.
