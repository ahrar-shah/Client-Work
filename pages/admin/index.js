import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', price: '', description: '', tag: '', discountSave: '' })
  const [imageBase64, setImageBase64] = useState('')
  const [msg, setMsg] = useState('')

  // 🔒 Auth check on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      window.location.href = '/admin/login'
    } else {
      setAuth(true)
      fetchProducts(token)
      fetchOrders(token)
    }
  }, [])

  async function fetchProducts(token) {
    const r = await fetch('/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (r.ok) {
      const j = await r.json()
      setProducts(j)
    }
  }

  async function fetchOrders(token) {
    const r = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (r.ok) {
      const j = await r.json()
      setOrders(j)
    } else {
      setOrders([])
    }
  }

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setImageBase64(reader.result)
    reader.readAsDataURL(f)
  }

  function suggestTag() {
    const name = (form.name || '').toLowerCase()
    if (form.price && Number(form.price) > 1000) return setForm({ ...form, tag: 'Premium' })
    if (name.includes('wireless') || name.includes('bluetooth')) return setForm({ ...form, tag: 'Wireless' })
    if (name.includes('gaming')) return setForm({ ...form, tag: 'Best Seller' })
    setForm({ ...form, tag: 'Popular' })
  }

  async function upload() {
    setMsg('')
    try {
      const token = localStorage.getItem('adminToken')
      const r = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, imageBase64 })
      })
      const j = await r.json()
      if (r.ok) {
        setMsg('Uploaded')
        setForm({ name: '', price: '', description: '', tag: '', discountSave: '' })
        setImageBase64('')
        fetchProducts(token)
      } else {
        setMsg('Error: ' + (j.error || 'unauthorized'))
      }
    } catch (err) {
      setMsg('Upload failed: ' + err.message)
    }
  }

  if (!auth) return <p>Checking auth...</p>

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Admin Panel</h2>

      <section style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Upload Product</h3>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <br />
          <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <br />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <br />
          <input placeholder="Tag" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
          <button onClick={suggestTag} style={{ marginLeft: 8 }}>Suggest Tag (AI)</button>
          <br />
          <input placeholder="Save Rs" value={form.discountSave} onChange={e => setForm({ ...form, discountSave: e.target.value })} />
          <br />
          <input type="file" onChange={handleFile} />
          <br />
          <button onClick={upload} style={{ marginTop: 8 }}>Upload</button>
          <div style={{ marginTop: 8 }}>{msg}</div>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Products (live)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {products.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <hr style={{ margin: '20px 0' }} />

      <h3>Orders</h3>
      <div>
        {orders.length === 0 && <div>No orders or you are not authorized to view orders.</div>}
        {orders.map(o => (
          <div key={o.id} style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
            <div><strong>{o.customerName}</strong> — {o.contact}</div>
            <div>Method: {o.method} — Total: Rs. {o.total}</div>
            <ul>{o.items.map((it, i) => (<li key={i}>{it.name} — {it.price}</li>))}</ul>
            <div>Ordered: {new Date(o.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
