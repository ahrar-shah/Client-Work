import { useEffect, useState } from 'react'

export default function Checkout() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', email: '', contact: '', address: '', method: 'Easypaisa' })
  const [screenshot, setScreenshot] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('checkoutItem') || '[]')
    setItems(data)
  }, [])

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setScreenshot(reader.result)
    reader.readAsDataURL(f)
  }

  async function placeOrder() {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items, screenshot })
    })
    const data = await res.json()
    if (res.ok) {
      setMsg('Order placed!')
      localStorage.removeItem('checkoutItem')
      localStorage.removeItem('cart')
    } else {
      setMsg(data.error || 'Failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>
      <h3>Items:</h3>
      <ul>{items.map((p, i) => <li key={i}>{p.name} - Rs. {p.price}</li>)}</ul>

      <h3>Enter Details</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><br/>
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><br/>
      <input placeholder="Contact Number" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /><br/>
      <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /><br/>

      <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
        <option>Easypaisa</option>
        <option>JazzCash</option>
        <option>Bank</option>
      </select><br/>

      <h3>Upload Payment Screenshot</h3>
      <input type="file" onChange={handleFile} /><br/>

      <button onClick={placeOrder}>Place Order</button>
      <div>{msg}</div>
    </div>
  )
}
