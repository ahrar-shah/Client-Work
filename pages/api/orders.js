let orders = []

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.json(orders)
  }

  if (req.method === 'POST') {
    const { name, email, contact, address, method, items, screenshot } = req.body
    if (!name || !contact || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing fields' })
    }
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
    return res.json({ ok: true, order })
  }

  res.status(405).end()
}
