---
title: E-commerce
summary: A general-purpose e-commerce site with search and filters, categories and subcategories, a cart and checkout with simulated transactions, plus an admin panel for the catalogue and orders.
---

A general-purpose online shop, built with **Node.js** and **Express** and an **HTML and CSS** interface. Customers search and filter products, add them to the cart and complete the purchase. Payment is **simulated**: the transaction is recorded in the database as if it had gone through, but no charge is actually made. An **admin panel** is used to manage the catalogue and review orders.

## Shop

- **Product search** by name and description
- **Filters** to narrow down results, for example by category and price range
- **Categories and subcategories**: the catalogue is organised as a tree, and choosing a category also shows the products in its subcategories
- **Cart** to add and remove products and change their quantity
- **Checkout** with an order summary and shipping details
- **Simulated transaction**: at the end of checkout the order is saved to the database as paid, without going through a real payment system

## Admin panel

- **Transaction list** with the details of every order
- **Catalogue management**: adding, editing and removing products
- **Category and subcategory management**

## How it works

Search combines text, category and filters into a single query. Choosing a category also includes its subcategories:

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

## How it's built

- **Node.js** with **Express** for the server: shop pages, search and cart APIs, admin panel routes
- **SQL database** for products, categories and transactions
- **HTML and CSS** for the shop and admin panel interfaces

> The original code has been lost: the snippet above is a simplified reconstruction of the logic, not the actual source.
