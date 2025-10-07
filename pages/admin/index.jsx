import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', price: '', description: '', tag: '', discountSave: '' })
  const [imageBase64, setImageBase64] = useState('')
  const [msg, setMsg] = useState('')
  const [siteName, setSiteName] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  // Custom Alert Function
  const showCustomAlert = (message, type = 'success') => {
    setAlertMessage(message)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  // 🔒 Auth check
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      window.location.href = '/admin/login'
    } else {
      setAuth(true)
      fetchProducts(token)
      fetchOrders(token)
    }
    
    // Get site name from environment
    setSiteName(process.env.NEXT_PUBLIC_SITE_NAME || 'Admin Panel')
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
        showCustomAlert('Product Uploaded Successfully! ✅', 'success')
        setForm({ name: '', price: '', description: '', tag: '', discountSave: '' })
        setImageBase64('')
        fetchProducts(token)
      } else {
        showCustomAlert('Error: ' + (j.error || 'unauthorized'), 'error')
      }
    } catch (err) {
      showCustomAlert('Upload failed: ' + err.message, 'error')
    }
  }

  if (!auth) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#0c0c0c',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <h3>Checking Authentication...</h3>
      </div>
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)', 
      color: '#ffffff',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Custom Alert */}
      {showAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: alertMessage.includes('Error') ? '#f44336' : '#4CAF50',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: '20px' }}>
            {alertMessage.includes('Error') ? '❌' : '✅'}
          </span>
          <span style={{ fontWeight: '600' }}>{alertMessage}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderBottom: '2px solid #ff4444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(255, 68, 68, 0.2)'
      }}>
        <h1 style={{ 
          margin: 0, 
          color: '#ff4444', 
          fontSize: '1.8rem', 
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🏪</span>
          {siteName}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#ffa726', fontSize: '14px' }}>
            📊 {products.length} Products • 📦 {orders.length} Orders
          </span>
          <button 
            style={{
              background: 'linear-gradient(45deg, #ff4444, #ff6b6b)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => {
              localStorage.removeItem('adminToken')
              window.location.href = '/admin/login'
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: '2.5rem',
          marginBottom: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #ff4444, #ffa726)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎯 Admin Dashboard
        </h2>

        {/* Upload Section */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Upload Form */}
            <div style={{
              background: 'rgba(30, 30, 30, 0.8)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid #333',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: '#ffa726', 
                marginBottom: '1.5rem', 
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📤</span>
                Upload Product
              </h3>
              
              <div style={{ marginBottom: '1.2rem' }}>
                <input 
                  placeholder="📝 Product Name" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <input 
                  placeholder="💰 Price" 
                  value={form.price} 
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <textarea 
                  placeholder="📄 Description" 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ 
                marginBottom: '1.2rem',
                display: 'flex',
                gap: '0.8rem',
                alignItems: 'center'
              }}>
                <input 
                  placeholder="🏷️ Tag" 
                  value={form.tag} 
                  onChange={e => setForm({ ...form, tag: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '0.8rem 1rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                <button 
                  onClick={suggestTag}
                  style={{
                    background: 'linear-gradient(45deg, #26c6da, #00acc1)',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.2rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🤖</span>
                  AI Suggest
                </button>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <input 
                  placeholder="💸 Save Rs" 
                  value={form.discountSave} 
                  onChange={e => setForm({ ...form, discountSave: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    onChange={handleFile} 
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    display: 'inline-block',
                    padding: '0.8rem 1.5rem',
                    background: 'linear-gradient(45deg, #66bb6a, #4caf50)',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center'
                  }}>
                    <span>🖼️</span>
                    Choose Product Image
                  </span>
                </label>
              </div>

              <button 
                onClick={upload}
                style={{
                  width: '100%',
                  background: 'linear-gradient(45deg, #ff4444, #ff6b6b)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'center'
                }}
              >
                <span>🚀</span>
                Upload Product
              </button>
            </div>

            {/* Products Preview */}
            <div style={{
              background: 'rgba(30, 30, 30, 0.8)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid #333',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: '#66bb6a', 
                marginBottom: '1.5rem', 
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📦</span>
                Live Products ({products.length})
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                gap: '1rem',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                {products.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ 
          height: '2px', 
          background: 'linear-gradient(90deg, transparent, #ff4444, transparent)', 
          margin: '2rem 0' 
        }} />

        {/* Orders Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{
            color: '#ffa726',
            marginBottom: '1.5rem',
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📋</span>
            Recent Orders ({orders.length})
          </h3>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#888',
                fontStyle: 'italic',
                padding: '3rem',
                background: 'rgba(30, 30, 30, 0.6)',
                borderRadius: '12px',
                border: '2px dashed #333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{ fontSize: '48px' }}>📭</div>
                <div>No orders found</div>
              </div>
            )}
            {orders.map(o => (
              <div key={o.id} style={{
                background: 'rgba(30, 30, 30, 0.8)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #333',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.8rem', 
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👤</span>
                    {o.name}
                  </strong>
                  <span style={{ color: '#ffa726' }}>— {o.contact}</span>
                  <span style={{ 
                    marginLeft: 'auto', 
                    color: '#888', 
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>🕒</span>
                    {new Date(o.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto', 
                  gap: '1rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ color: '#ccc', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📍</span>
                    {o.address}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💳</span>
                    Method: {o.method}
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                  {o.items.map((it, i) => (
                    <li key={i} style={{ 
                      padding: '0.5rem 0', 
                      borderBottom: '1px solid #333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span>📦</span>
                      {it.name} — <span style={{ color: '#66bb6a', fontWeight: '600' }}>Rs.{it.price}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Payment Screenshot */}
                {o.screenshot && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <b>🖼️ Payment Proof:</b>
                    </p>
                    <img 
                      src={o.screenshot} 
                      alt="payment proof" 
                      style={{ 
                        maxWidth: '200px', 
                        border: '2px solid #444', 
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
