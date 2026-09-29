---
title: E-commerce
languages: [js]
frameworks: [Node.js, Express]
tags: [SQL, HTML, CSS]
summary: Un e-commerce generico con ricerca e filtri, categorie e sottocategorie, carrello e checkout con transazioni simulate, più un pannello admin per il catalogo e gli ordini.
screenshots: []
github: null
demo: null
video: null
---

Un negozio online generico, costruito con **Node.js** ed **Express** e un'interfaccia in **HTML e CSS**. Il cliente cerca e filtra i prodotti, li mette nel carrello e completa l'acquisto. Il pagamento è **simulato**: la transazione viene registrata nel database come se fosse andata a buon fine, ma nessun addebito avviene davvero. Un **pannello admin** permette di gestire il catalogo e di consultare gli ordini.

## Negozio

- **Ricerca prodotti** per nome e descrizione
- **Filtri** per affinare i risultati, per esempio per categoria e fascia di prezzo
- **Categorie e sottocategorie**: il catalogo è organizzato ad albero, e scegliendo una categoria compaiono anche i prodotti delle sue sottocategorie
- **Carrello** in cui aggiungere, togliere e cambiare la quantità dei prodotti
- **Checkout** con riepilogo dell'ordine e dati di spedizione
- **Transazione simulata**: al termine del checkout l'ordine viene salvato nel database come pagato, senza passare da un vero sistema di pagamento

## Pannello admin

- **Elenco delle transazioni** con il dettaglio di ogni ordine
- **Gestione del catalogo**: aggiunta, modifica e rimozione dei prodotti
- **Gestione di categorie e sottocategorie**

## Come funziona

La ricerca combina testo, categoria e filtri in un'unica query. Scegliendo una categoria si includono anche le sue sottocategorie:

```js
app.get("/api/prodotti", async (req, res) => {
  const { q, categoria, prezzoMin, prezzoMax } = req.query;
  const condizioni = [];
  const parametri = [];

  if (q) {
    condizioni.push("(p.nome LIKE ? OR p.descrizione LIKE ?)");
    parametri.push(`%${q}%`, `%${q}%`);
  }
  if (categoria) {
    // la categoria scelta e le sue sottocategorie
    condizioni.push("(c.id = ? OR c.padre_id = ?)");
    parametri.push(categoria, categoria);
  }
  if (prezzoMin) { condizioni.push("p.prezzo >= ?"); parametri.push(prezzoMin); }
  if (prezzoMax) { condizioni.push("p.prezzo <= ?"); parametri.push(prezzoMax); }

  const where = condizioni.length ? `WHERE ${condizioni.join(" AND ")}` : "";
  const [prodotti] = await db.query(
    `SELECT p.* FROM prodotti p JOIN categorie c ON c.id = p.categoria_id ${where}`,
    parametri,
  );
  res.json(prodotti);
});
```

## Come è fatto

- **Node.js** con **Express** per il server: pagine del negozio, API per ricerca e carrello, rotte del pannello admin
- **Database SQL** per prodotti, categorie e transazioni
- **HTML e CSS** per l'interfaccia del negozio e del pannello admin

> Il codice originale è andato perso: il frammento qui sopra è una ricostruzione semplificata della logica, non il sorgente reale.
