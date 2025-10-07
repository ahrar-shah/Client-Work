import jwt from 'jsonwebtoken'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    // create JWT
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.json({ token })
  }

  return res.status(401).json({ error: 'Invalid password' })
}
