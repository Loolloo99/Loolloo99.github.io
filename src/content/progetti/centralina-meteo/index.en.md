---
title: Weather station
summary: A home-made weather station that measures temperature, humidity, pressure and PM10 particulate matter, sending the data over MQTT to a Node server with Express, viewable from a web page.
---

A weather station built from scratch, from the hardware to the web page. The **sensors** measure temperature, humidity, pressure and **PM10 particulate matter**, **Arduino** reads them and an **ESP32** module sends the readings over the network via **MQTT** to a **Mosquitto** broker. A **Node.js** server with **Express** receives them, stores them in a **SQL database** and makes them available to an **HTML and CSS** interface where they can be viewed.

## What it does

- **Weather and air quality**: temperature, humidity, atmospheric pressure and PM10 concentration, sampled at regular intervals
- **Network delivery**: the ESP32 publishes the readings to the Mosquitto broker via MQTT, a lightweight protocol designed for IoT devices
- **Measurement history**: every reading is saved to the database, so the data stays available over time
- **Browser access**: a web page shows the values recorded by the station

## How it works

The path of a reading, from sensor to page:

1. **Arduino** reads the temperature, humidity, pressure and PM10 sensors
2. **ESP32** connects to Wi-Fi and publishes the readings to an MQTT topic on the **Mosquitto** broker
3. **Node.js** is subscribed to the topic on Mosquitto, receives every message and stores it in the SQL database
4. The **front end** in HTML and CSS requests the data from the **Express** APIs and displays it

On the server side, the core is receiving messages, saving them and the API that returns the readings to the page:

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

## How it's built

- **Arduino** to read the sensors
- **ESP32** for the Wi-Fi connection and sending readings via **MQTT**
- **Mosquitto** as the MQTT broker, bridging the station and the server
- **Node.js** with **Express** for the server: it receives MQTT messages, writes to the database and exposes the APIs the page reads from
- **SQL database** for the measurement history
- **HTML and CSS** for the viewing interface

> The original code has been lost: the snippet above is a simplified reconstruction of the logic, not the actual source.
