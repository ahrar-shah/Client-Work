// JSONBin config
const BIN_ID = process.env.NEXT_PUBLIC_JSONBIN_ID
const API_KEY = process.env.JSONBIN_API_KEY
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

// Fetch orders from JSONBin
async function getOrders() {
  const r = await fetch(`${BASE_URL}/latest`, {
    headers: { "X-Master-Key": API_KEY }
  })
  const j = await r.json()
  return j.record.orders || []
}

// Save orders to JSONBin
async function saveOrders(orders, products) {
  await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({ products, orders })
  })
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const orders = await getOrders()
    return res.json(orders)
  }

  if (req.method === "POST") {
    const { name, email, contact, address, method, items, screenshot } = req.body
    if (!name || !contact || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing fields" })
    }

    // fetch existing data (both products + orders)
    const r = await fetch(`${BASE_URL}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    })
    const j = await r.json()
    const products = j.record.products || []
    const orders = j.record.orders || []

    const order = {
      id: Date.now().toString(),
      name,
      email,
      contact,
      address,
      method,
      items,
      screenshot,
      createdAt: new Date()
    }

    orders.unshift(order)
    await saveOrders(orders, products)

    return res.json({ ok: true, order })
  }

  res.status(405).end()
}
