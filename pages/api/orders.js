// In-memory orders
let orders = []

import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

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
  } catch (e) {
    return null
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    // only admin can list orders
    const verified = verifyFromRequest(req)
    if (!verified || verified.role !== 'admin') return res.status(401).json({ error: 'unauthorized' })
    return res.json(orders)
  }

  if (req.method === 'POST') {
    const { items, customerName, contact, method, total } = req.body
    if (!items || !customerName) return res.status(400).json({ error: 'missing fields' })
    const o = {
      id: Date.now().toString(),
      items,
      customerName,
      contact,
      method,
      total,
      createdAt: new Date()
    }
    orders.unshift(o)
    return res.json({ ok: true, order: o })
  }

  res.status(405).end()
}
