---
title: Desktop Pet, la mascotte anti doomscrolling
languages: [python]
frameworks: [PySide6]
tags: [Qt, QtNetwork, Win32 API, ctypes, macOS, PyObjC, psutil, PyInstaller, GitHub Actions, i18n, pixel art]
year: 2026
summary: Una mascotte in pixel art che vive sul desktop di Windows e macOS e, quando apri un social, corre a chiuderti la scheda.
screenshots:
  - ./copertina.png
  - ./attacco.png
  - ./coccole.png
  - ./dashboard.png
  - ./taccuino.png
  - ./impostazioni-comportamento.png
  - ./impostazioni-giochi.png
  - ./presentazione.png
  - ./impostazioni-aspetto.png
github: null
demo: null
video: progetti/desktop-pet/demo.mp4
---

**Sentinella** è un'app desktop per Windows e macOS che mette una mascotte sopra a tutte le finestre. Fa compagnia: passeggia lungo la barra delle applicazioni, gioca a palla, si addormenta e si lascia accarezzare col mouse. Intanto però tiene d'occhio lo schermo: se si apre YouTube, Instagram, TikTok o un altro sito da doomscrolling suona l'allarme, trema per qualche secondo e poi, se la finestra è ancora lì, corre fino alla **X** e chiude **solo quella scheda**.

Non blocca niente in rete e non legge quello che scrivi: guarda soltanto i titoli delle finestre aperte.

## Cosa fa

- **Anti doomscrolling**: riconosce i siti dal titolo della scheda (con parole bloccate ed eccezioni, es. `youtube` sì ma `youtube music` no) e i programmi dal nome del processo, poi insegue la finestra anche se la sposti
- **Una vita propria**: riposo, passeggiate su più monitor, voli, cadute con gravità e rimbalzi, pisolini, un saluto quando torni al PC, le coccole passando il mouse e una faccia apposta per quando si mette a scrivere anche lei
- **Giochi**: lancio della palla (chi sa volare la rincorre anche per aria), nascondino, il trampolino (tenerla in aria due minuti raccogliendo pallini, con il record) e una matita per disegnarle un recinto sullo schermo
- **Tempo concesso**: qualche minuto di social al giorno prima che intervenga, pause a tempo e "non disturbare" a schermo intero
- **Dashboard** con le statistiche della settimana: tempo sui social giorno per giorno, cacce, schede chiuse, siti più guardati, e poi lanci, passeggiate, metri percorsi e pause
- **Taccuino**: un editor di note in **Markdown**, con la ricerca, la sintassi che si colora mentre scrivi e l'anteprima
- **Amici in rete**: le Sentinelle della stessa rete locale si trovano e si vanno a trovare
- **Come sta il computer**: CPU, RAM e temperatura, con limiti oltre i quali la mascotte viene ad avvisarti
- **Frasi motivazionali** ogni tanto, con la voce della mascotte che hai importato
- **Eventi e promemoria**, con un fumetto e un suono dedicato

## La mascotte va a trovare gli amici

Con la visibilità accesa le Sentinelle della stessa rete locale si trovano da sole. Scegli una mascotte dall'elenco, scrivi un messaggio e dall'altra parte compare un biglietto: *«Pippo vuole passare a salutare Ugo. La fai entrare?»*. Se dice di sì, la tua mascotte **esce a piedi dal bordo del tuo schermo** e soltanto quando è uscita del tutto compare su quello dell'amico: arriva camminando alla sua velocità, si ferma accanto alla mascotte di casa, si salutano, consegna il messaggio e se ne va. Può anche portare una nota del taccuino, che arriva fra gli appunti dell'altro col nome di chi l'ha mandata.

![La pagina Amici: le Sentinelle trovate in rete, con il messaggio da mandare](./impostazioni-amici.png)

Sotto c'è un faro UDP in broadcast ogni tre secondi per farsi trovare e una connessione TCP con un JSON per riga per il saluto; le facce del saluto e della passeggiata viaggiano come PNG in base64. Siccome nessuno si autentica, il protocollo è scritto dando per scontato che dall'altra parte ci sia chiunque: le immagini partono solo dopo il sì di chi riceve, le righe hanno un tetto, i fotogrammi sono contati e controllati uno per uno (solo PNG, con la firma verificata prima di passarli a Qt), nome e messaggio vengono ripuliti da caratteri di controllo e trucchi bidi, e un "portinaio" accetta un invito per mittente al minuto. A visibilità spenta non resta aperto nessun socket.

## Completamente personalizzabile

Tutto si regola da un'unica finestra di impostazioni, con una ricerca che porta dritti alla regolazione giusta e la evidenzia.

![La pagina Sorveglianza: parole bloccate, eccezioni e programmi da sorvegliare](./impostazioni-sorveglianza.png)

Ogni stato della mascotte ha la sua "faccia": un'immagine fissa, una GIF o una sequenza di fotogrammi, con anteprima animata. Anche i tre suoni (allarme, attacco, promemoria) si cambiano, e si possono estrarre direttamente dall'audio di un video.

![La pagina Immagini, con le facce animate di ogni stato](./impostazioni-immagini.png)

Con **Nuova mascotte** se ne crea una da zero: nome, se sa volare, facce e suoni. Prima di sostituire quella attuale l'app ne fa un backup automatico.

![La procedura guidata per creare una nuova mascotte](./impostazioni-nuova.png)

## Profili pronti all'uso

Una mascotte intera (impostazioni, frasi, immagini e suoni) sta in un unico file `.sentinella` da esportare, passare a qualcuno o reimportare. Oltre al **gatto nero** di serie ce ne sono altri quattro: un **bradipo** lentissimo, un **drago rosso**, un **panda** che invece di camminare rotola e un **san bernardo**, ognuno con sprite, versi e frasi propri.

![Le cinque mascotte pronte: gatto nero, bradipo, drago rosso, panda e san bernardo](./mascotte.png)

![La pagina Profili con i profili pronti](./impostazioni-profili.png)

Un profilo si esporta anche fuori dalla cartella — sul Desktop, su una chiavetta, in una cartella condivisa — e se ne aggiunge uno preso da fuori, che passa dagli stessi controlli prima di essere copiato.

L'import tratta il file come contenuto non fidato: lista bianca dei percorsi ammessi, niente risalite `..` né eseguibili, conferma esplicita e backup prima di sovrascrivere.

## Italiano e inglese

L'app parla due lingue: di serie segue quella del sistema, e si cambia al volo senza riavviare. I testi però restano scritti **in italiano nel codice**, dentro `tr()`: l'italiano fa da chiave e un catalogo dice come si dice in inglese, così il codice si legge come prima e un testo ancora senza traduzione esce in italiano invece di rompere qualcosa. Un test rilegge il sorgente senza eseguirlo e fallisce se un `tr()` non ha la sua voce nel catalogo, o se nel catalogo restano traduzioni che non usa più nessuno.

## Windows e macOS, stesso codice

Nata per Windows, la Sentinella ora gira anche su **macOS 13+**. Tutto quello che non è Qt (finestre, mouse, tasti, permessi, suoni, avvio automatico) è passato dietro un unico contratto, con un backend per sistema operativo; il resto dell'app è identico sulle due piattaforme.

Su Mac cambia qualche dettaglio: l'icona sta nella barra dei menu, la scheda si chiude con `Cmd+W`, la mascotte resta sopra le app a schermo intero su ogni Space e i profili `.sentinella` si spostano da Windows a Mac e viceversa. macOS chiede però due permessi da concedere a mano (**Registrazione schermo** per leggere i titoli delle finestre, **Accessibilità** per chiudere la scheda), e la presentazione del primo avvio ha un passo apposta con un pulsante per ciascuno e una spunta che compare appena vengono concessi. L'unico gioco limitato è il nascondino: macOS non permette di mettere una finestra dietro quelle di un'altra app, quindi la mascotte si nasconde solo oltre il bordo dello schermo.

> Il porting su macOS è recente e non è ancora stato provato su un Mac vero: per ora è verificato dalla CI.

## Come è fatto

- **PySide6 (Qt)** per le finestre trasparenti senza bordi, le animazioni e tutta l'interfaccia, disegnata con un tema scuro coerente e icone vettoriali
- Un pacchetto **`piattaforma/`** con il contratto comune e un backend per sistema, così la logica si importa e si testa ovunque
- **Win32 API via `ctypes`** su Windows per enumerare le finestre, leggere titoli e processi, trovare il pulsante di chiusura e simulare click e `Ctrl+W`, gestire DPI e multi-monitor
- **Quartz, AppKit, Accessibilità, Carbon e AVFoundation via PyObjC** su macOS, senza API private che si romperebbero a ogni aggiornamento del sistema — l'unica eccezione sono i sensori di temperatura, non documentati ma letti allo stesso modo dagli strumenti di monitoraggio da anni
- **QtNetwork** per i saluti fra Sentinelle: stesso codice sulle due piattaforme, fuori da `piattaforma/`
- **psutil** per CPU e RAM, letti in un thread a parte perché su Windows la temperatura passa da PowerShell e costa un secondo buono
- Sprite in **pixel art** generati via codice con `QPainter`, uno script per ogni mascotte
- Interfaccia che segue il ridimensionamento di Windows (100%–200%) con una preferenza in più per testi e mascotte
- Distribuzione con PyInstaller come **`Sentinella.exe`** su Windows e **`Sentinella.app` / `.dmg`** su Mac, oppure con uno script di installazione per sistema che prepara Python, l'ambiente virtuale e l'avvio automatico
- **GitHub Actions** fa girare i test su Windows e macOS a ogni push, costruisce il `.dmg` e, a ogni versione, pubblica `.exe` e `.dmg` in una release

> Il video in alto è un'animazione: il desktop, la barra delle applicazioni e la finestra del browser sono disegnati, la mascotte e le finestre dell'app sono quelle vere. Le schermate sono catturate dall'applicazione.
