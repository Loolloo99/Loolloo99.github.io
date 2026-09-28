---
title: Centralina meteo
languages: [js]
frameworks: [Node.js, Express]
tags: [Arduino, ESP32, PM10, MQTT, Mosquitto, SQL, HTML, CSS, IoT]
summary: Una centralina meteo fatta in casa che misura temperatura, umidità, pressione e polveri sottili PM10 e manda i dati via MQTT a un server Node con Express, consultabili da una pagina web.
screenshots: []
github: null
demo: null
video: null
---

Una stazione meteo costruita da zero, dall'hardware alla pagina web. I **sensori** misurano temperatura, umidità, pressione e **polveri sottili PM10**, **Arduino** li legge e un modulo **ESP32** invia le misure in rete tramite **MQTT** a un broker **Mosquitto**. Un server **Node.js** con **Express** le riceve, le salva in un **database SQL** e le mette a disposizione di un'interfaccia in **HTML e CSS** da cui consultarle.

## Cosa fa

- **Meteo e qualità dell'aria**: temperatura, umidità, pressione atmosferica e concentrazione di PM10, rilevate a intervalli regolari
- **Invio in rete**: l'ESP32 pubblica le letture sul broker Mosquitto via MQTT, un protocollo leggero pensato per i dispositivi IoT
- **Storico delle misure**: ogni lettura viene salvata nel database, così i dati restano consultabili anche nel tempo
- **Consultazione dal browser**: una pagina web mostra i valori registrati dalla centralina

## Come funziona

Il percorso di un dato, dal sensore alla pagina:

1. **Arduino** legge i sensori di temperatura, umidità, pressione e PM10
2. **ESP32** si collega al Wi-Fi e pubblica le misure su un topic MQTT del broker **Mosquitto**
3. **Node.js** è iscritto al topic su Mosquitto, riceve ogni messaggio e lo registra nel database SQL
4. Il **front end** in HTML e CSS chiede i dati alle API **Express** e li mostra

Lato server, il cuore è la ricezione dei messaggi, il salvataggio e l'API che restituisce le misure alla pagina:

```js
client.subscribe("centralina/misure");

client.on("message", async (topic, payload) => {
  const { temperatura, umidita, pressione, pm10 } = JSON.parse(payload);

  await db.query(
    "INSERT INTO misure (temperatura, umidita, pressione, pm10, rilevata_il) VALUES (?, ?, ?, ?, NOW())",
    [temperatura, umidita, pressione, pm10],
  );
});

app.get("/api/misure", async (req, res) => {
  const [misure] = await db.query("SELECT * FROM misure ORDER BY rilevata_il DESC LIMIT 100");
  res.json(misure);
});
```

## Come è fatto

- **Arduino** per la lettura dei sensori
- **ESP32** per la connessione Wi-Fi e l'invio delle misure via **MQTT**
- **Mosquitto** come broker MQTT, a fare da tramite tra la centralina e il server
- **Node.js** con **Express** per il server: riceve i messaggi MQTT, scrive nel database ed espone le API da cui la pagina legge i dati
- **Database SQL** per lo storico delle misure
- **HTML e CSS** per l'interfaccia di consultazione

> Il codice originale è andato perso: il frammento qui sopra è una ricostruzione semplificata della logica, non il sorgente reale.
