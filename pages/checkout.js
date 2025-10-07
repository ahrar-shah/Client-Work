import { useState } from 'react'

export default function Checkout() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [method, setMethod] = useState('easypaisa')
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')

  const addItem = () => {
    const name = prompt('Product name')
    const price = Number(prompt('price'))
    if (!name || !price) return
    const newItems = [...items, { name, price }]
    setItems(newItems)
    setTotal(newItems.reduce((s, i) => s + i.price, 0))
  }

  const submit = async () => {
    if (!name) return alert('enter name')
    const r = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items, customerName: name, contact, method, total })
    })
    const j = await r.json()
    if (j.ok) {
      setStatus('Order placed. Admin will see it in admin panel.')
      setItems([])
      setTotal(0)
    } else {
      setStatus('Error: ' + (j.error || 'unknown'))
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h2>Checkout</h2>
      <p>Simple demo checkout. Add item -> choose method -> place order.</p>

      <div style={{ margin: '12px 0' }}>
        <button onClick={addItem}>Add item to cart</button>
      </div>

      <ul>
        {items.map((it, i) => (<li key={i}>{it.name} — Rs. {it.price}</li>))}
      </ul>

      <div>Total: Rs. {total}</div>

      <div style={{ marginTop: 12 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        <br />
        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact (phone / email)" />
      </div>

      <div style={{ marginTop: 12 }}>
        <label><input type="radio" name="m" checked={method === 'easypaisa'} onChange={() => setMethod('easypaisa')} /> EasyPaisa</label>
        <label style={{ marginLeft: 12 }}><input type="radio" name="m" checked={method === 'jazzcash'} onChange={() => setMethod('jazzcash')} /> JazzCash</label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={submit}>Place Order (simulate payment)</button>
      </div>

      {status && <div style={{ marginTop: 12 }}>{status}</div>}
    </div>
  )
}
