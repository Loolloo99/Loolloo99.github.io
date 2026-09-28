---
title: Portfolio
languages: [ts]
frameworks: [Astro]
tags: [Content Collections, Zod, Shiki, CSS]
year: 2026
summary: Il sito che stai guardando, un terminale a fosfori con una lente che mostra il codice sotto la pagina.
screenshots: [./copertina.png]
github: https://github.com/Loolloo99/Loolloo99.github.io
demo: null
video: null
---

Il sito che stai guardando. Un sito statico in **Astro** che ricorda un vecchio terminale a fosfori: testi monospazio, bagliore sui caratteri e due colori a scelta, **ambra** o **verde**.

## Cosa fa

- **Navigazione da terminale 3270**: i tasti funzione aprono le sezioni, `F1` stack, `F2` progetti, `F3` contatti, e `F4` passa all'altra lingua
- **Stack in ordine di esperienza**: linguaggi con i loro framework e il numero di progetti, più gli strumenti AI che uso ogni giorno
- **Progetti divisi per linguaggio**: schede accessibili da tastiera, con l'indirizzo che segue la scheda aperta (`#progetti/python`) così un link porta dritti al gruppo giusto
- **Progetti con più linguaggi**: un progetto Laravel + React compare una sola volta in "Tutti", sotto il linguaggio principale, e in entrambe le schede dei singoli linguaggi
- **Filtri per framework** dentro ogni linguaggio, quando i progetti ne usano più di uno
- **Modalità inspect code**: il pulsante con la lente (o il tasto `I`) trasforma il cursore in una lente che mostra il markup HTML sotto la pagina, con il file sorgente del componente; `+` e `−` ne cambiano la dimensione, `Esc` per uscire
- **La lente parla il linguaggio del progetto**: nelle pagine progetto lo stesso markup diventa un template Blade, JSX, Django, Jinja2, Thymeleaf, PHP, JavaScript o TypeScript, o una SCREEN SECTION COBOL, con i dati al posto delle variabili. Il codice sotto la lente usa il fosforo opposto a quello della pagina
- **Pagine progetto complete**: screenshot o video dimostrativo (con la copertina come poster), scheda con linguaggi, framework e tecnologie, e link al progetto precedente e successivo
- **Anteprime generate**: se un progetto non ha screenshot compare una finestra da editor con codice nel suo linguaggio
- **Italiano e inglese**, con un selettore di lingua che resta sulla stessa pagina e sulla stessa scheda
- **Fosforo ambra o verde**, ricordato tra una visita e l'altra e applicato prima del rendering, senza lampeggi

## Come è fatto

- **Astro** con output completamente statico: nessun server, si pubblica su qualsiasi hosting
- **Content Collections** per i progetti: una cartella con un file Markdown (più la sua traduzione inglese) e gli screenshot, validata con uno schema **Zod** che ferma la build se manca un campo o un linguaggio non esiste
- Immagini ottimizzate in fase di build e blocchi di codice evidenziati con **Shiki**
- **TypeScript** per la lente: serializza il DOM visibile e lo traduce nei vari dialetti di template grazie agli attributi `data-bind`, `data-each` e `data-if`; il dialetto si sceglie dal framework del progetto o, in mancanza, dal linguaggio
- **SEO e condivisione**: URL canonici, `hreflang` per le due lingue, immagini Open Graph generate dalla copertina e favicon disegnata dalle iniziali
- **CSS** senza framework, con variabili per i due temi, rispettando `prefers-reduced-motion`

> Il codice mostrato dalla lente nelle pagine progetto è illustrativo, non il sorgente reale.
