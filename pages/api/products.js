// In-memory products (server RAM)
let products = []

import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

function verifyFromRequest(req) {
  // Check cookie token or Authorization header
  try {
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1]
      return jwt.verify(token, process.env.JWT_SECRET)
    }
    // check cookies
    const cookie = req.headers.cookie
    if (!cookie) return null
    const parsed = parse(cookie)
    if (!parsed.token) return null
    return jwt.verify(parsed.token, process.env.JWT_SECRET)
  } catch (e) {
    return null
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { q } = req.query
    const list = q ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())) : products
    return res.json(list)
  }

  if (req.method === 'POST') {
    // Only admin can post (create product)
    const verified = verifyFromRequest(req)
    if (!verified || verified.role !== 'admin') return res.status(401).json({ error: 'unauthorized' })

    const { name, price, description, tag, discountSave, imageBase64 } = req.body
    if (!name || !price) return res.status(400).json({ error: 'missing fields' })

    const p = {
      id: Date.now().toString(),
      name,
      price: Number(price),
      description: description || '',
      tag: tag || '',
      discountSave: discountSave || '',
      imageBase64: imageBase64 || '',
      createdAt: new Date()
    }
    products.unshift(p)
    return res.json({ ok: true, product: p })
  }

  res.status(405).end()
}
