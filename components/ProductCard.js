import React from 'react'

export default function ProductCard({ p }) {
  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, maxWidth: 320 }}>
      {p.imageBase64 ? (
        <img src={p.imageBase64} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }} />
      ) : (
        <div style={{ height: 180, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
      )}
      <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
      <div>{p.tag && <small style={{ padding: '2px 6px', background: '#fffae6', borderRadius: 6 }}>{p.tag}</small>}</div>
      <p style={{ fontSize: 13 }}>{p.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Rs. {p.price}</strong>
        {p.discountSave && <small>Save Rs {p.discountSave}</small>}
      </div>
    </div>
  )
}
