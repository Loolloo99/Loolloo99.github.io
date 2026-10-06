---
title: Gestione automatica dei carichi elettrici
languages: [python]
frameworks: []
tags: [meross_iot, asyncio, IoT, smart plug]
summary: Controlla in tempo reale il consumo delle prese smart e, prima che salti la luce, spegne quelle meno importanti.
screenshots: []
github: null
demo: null
video: null
---

Un programma in **Python** che fa da "salvavita intelligente" per le prese smart **Meross**. Legge in tempo reale quanto consuma ogni presa e, se la somma supera il limite impostato, spegne le prese una alla volta, partendo dalla meno importante, finché il consumo non torna sotto la soglia. Così il contatore non stacca tutta la casa.

## Cosa fa

- **Consumo in tempo reale**: si collega all'account Meross e legge la potenza assorbita da ogni presa con misurazione dei consumi
- **Limite impostabile**: una soglia in watt per il consumo totale, da adattare alla potenza del proprio contratto
- **Ordine di priorità**: ogni presa ha una priorità. Quando si supera il limite si stacca prima quella meno importante, e si continua solo se non basta
- **Il minimo indispensabile**: dopo ogni spegnimento ricontrolla il totale e si ferma appena il consumo rientra, senza staccare più del necessario

## Come funziona

Il cuore del programma è un ciclo che somma i consumi e, se serve, scende nella lista delle priorità:

```python
async def controlla(prese, limite_w):
    consumi = {presa: await presa.consumo() for presa in prese}
    totale = sum(consumi.values())

    # priorità 1 = la più importante: si stacca dal numero più alto
    for presa in sorted(prese, key=lambda p: p.priorita, reverse=True):
        if totale <= limite_w:
            break
        if consumi[presa] > 0:
            await presa.spegni()
            totale -= consumi[presa]
```

## Come è fatto

- **[meross_iot](https://github.com/albertogeniola/MerossIot)** per accedere all'account Meross, trovare le prese e leggerne i consumi e lo stato
- **asyncio**, perché la libreria è asincrona: le letture delle prese partono insieme e il controllo si ripete a intervalli brevi
- Configurazione con credenziali dell'account, limite in watt e priorità di ogni presa

> Il codice originale è andato perso: il frammento qui sopra è una ricostruzione semplificata della logica, non il sorgente reale.
