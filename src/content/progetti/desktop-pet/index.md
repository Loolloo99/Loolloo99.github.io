---
title: Sentinella, la mascotte anti doomscrolling
languages: [python]
frameworks: [PySide6]
tags: [Qt, Win32 API, ctypes, macOS, PyObjC, PyInstaller, GitHub Actions, pixel art]
year: 2026
summary: Una mascotte in pixel art che vive sul desktop di Windows e macOS e, quando apri un social, corre a chiuderti la scheda.
screenshots:
  - ./copertina.png
  - ./attacco.png
  - ./coccole.png
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
- **Una vita propria**: riposo, passeggiate su più monitor, voli, cadute con gravità e rimbalzi, pisolini, un saluto quando torni al PC e le coccole passando il mouse
- **Giochi**: lancio della palla, nascondino, il trampolino (tenerla in aria due minuti raccogliendo pallini, con record nel taccuino) e una matita per disegnarle un recinto sullo schermo
- **Tempo concesso**: qualche minuto di social al giorno prima che intervenga, pause a tempo e "non disturbare" a schermo intero
- **Taccuino** con le statistiche della settimana: tempo sui social, cacce, schede chiuse, siti più guardati
- **Eventi e promemoria**, con un fumetto e un suono dedicato

## Completamente personalizzabile

Tutto si regola da un'unica finestra di impostazioni, con una ricerca che porta dritti alla regolazione giusta e la evidenzia.

![La pagina Sorveglianza: parole bloccate, eccezioni e programmi da sorvegliare](./impostazioni-sorveglianza.png)

Ogni stato della mascotte ha la sua "faccia": un'immagine fissa, una GIF o una sequenza di fotogrammi, con anteprima animata. Anche i tre suoni (allarme, attacco, promemoria) si cambiano, e si possono estrarre direttamente dall'audio di un video.

![La pagina Immagini, con le facce animate di ogni stato](./impostazioni-immagini.png)

Con **Nuova mascotte** se ne crea una da zero: nome, se sa volare, facce e suoni. Prima di sostituire quella attuale l'app ne fa un backup automatico.

![La procedura guidata per creare una nuova mascotte](./impostazioni-nuova.png)

## Profili pronti all'uso

Una mascotte intera (impostazioni, frasi, immagini e suoni) sta in un unico file `.sentinella` da esportare, passare a qualcuno o reimportare. Oltre al **gatto nero** di serie ci sono già un **bradipo** e un **drago rosso**, ognuno con sprite e versi propri.

![Le tre mascotte disponibili: gatto nero, bradipo e drago rosso](./mascotte.png)

![La pagina Profili con i profili pronti](./impostazioni-profili.png)

L'import tratta il file come contenuto non fidato: lista bianca dei percorsi ammessi, niente risalite `..` né eseguibili, conferma esplicita e backup prima di sovrascrivere.

## Windows e macOS, stesso codice

Nata per Windows, la Sentinella ora gira anche su **macOS 13+**. Tutto quello che non è Qt (finestre, mouse, tasti, permessi, suoni, avvio automatico) è passato dietro un unico contratto, con un backend per sistema operativo; il resto dell'app è identico sulle due piattaforme.

Su Mac cambia qualche dettaglio: l'icona sta nella barra dei menu, la scheda si chiude con `Cmd+W`, la mascotte resta sopra le app a schermo intero su ogni Space e i profili `.sentinella` si spostano da Windows a Mac e viceversa. macOS chiede però due permessi da concedere a mano (**Registrazione schermo** per leggere i titoli delle finestre, **Accessibilità** per chiudere la scheda), e la presentazione del primo avvio ha un passo apposta con un pulsante per ciascuno e una spunta che compare appena vengono concessi. L'unico gioco limitato è il nascondino: macOS non permette di mettere una finestra dietro quelle di un'altra app, quindi la mascotte si nasconde solo oltre il bordo dello schermo.

> Il porting su macOS è recente e non è ancora stato provato su un Mac vero: per ora è verificato dalla CI.

## Come è fatto

- **PySide6 (Qt)** per le finestre trasparenti senza bordi, le animazioni e tutta l'interfaccia, disegnata con un tema scuro coerente e icone vettoriali
- Un pacchetto **`piattaforma/`** con il contratto comune e un backend per sistema, così la logica si importa e si testa ovunque
- **Win32 API via `ctypes`** su Windows per enumerare le finestre, leggere titoli e processi, trovare il pulsante di chiusura e simulare click e `Ctrl+W`, gestire DPI e multi-monitor
- **Quartz, AppKit, Accessibility e AVFoundation via PyObjC** su macOS, senza API private che si romperebbero a ogni aggiornamento del sistema
- Sprite in **pixel art** generati via codice con `QPainter`, uno script per ogni mascotte
- Interfaccia che segue il ridimensionamento di Windows (100%–200%) con una preferenza in più per testi e mascotte
- Distribuzione con PyInstaller come **`Sentinella.exe`** su Windows e **`Sentinella.app` / `.dmg`** su Mac, oppure con uno script di installazione per sistema che prepara Python, l'ambiente virtuale e l'avvio automatico
- **GitHub Actions** fa girare i test su Windows e macOS a ogni push, costruisce il `.dmg` e, a ogni versione, pubblica `.exe` e `.dmg` in una release

> Il video in alto è un'animazione ricostruita con gli sprite reali dell'app. Le schermate delle impostazioni sono catturate dall'applicazione.
