import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

// JSONBin config
const BIN_ID = process.env.NEXT_PUBLIC_JSONBIN_ID
const API_KEY = process.env.JSONBIN_API_KEY
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

// Verify JWT token
function verifyFromRequest(req) {
  try {
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1]
      return jwt.verify(token, process.env.JWT_SECRET)
    }
    const cookie = req.headers.cookie
    if (!cookie) return null
    const parsed = parse(cookie)
    if (!parsed.token) return null
    return jwt.verify(parsed.token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

// Fetch products from JSONBin
async function getProducts() {
  const r = await fetch(`${BASE_URL}/latest`, {
    headers: { "X-Master-Key": API_KEY }
  })
  const j = await r.json()
  return j.record.products || []
}

// Save products to JSONBin
async function saveProducts(products) {
  await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({ products })
  })
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { q } = req.query
    const products = await getProducts()
    const list = q
      ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
      : products
    return res.json(list)
  }

  if (req.method === "POST") {
    const verified = verifyFromRequest(req)
    if (!verified || verified.role !== "admin")
      return res.status(401).json({ error: "unauthorized" })

    const { name, price, description, tag, discountSave, imageBase64 } = req.body
    if (!name || !price) return res.status(400).json({ error: "missing fields" })

    const products = await getProducts()

    const p = {
      id: Date.now().toString(),
      name,
      price: Number(price),
      description: description || "",
      tag: tag || "",
      discountSave: discountSave || "",
      imageBase64: imageBase64 || "",
      createdAt: new Date()
    }

    products.unshift(p)
    await saveProducts(products)

    return res.json({ ok: true, product: p })
  }

  res.status(405).end()
}
