import useSWR from 'swr'
import { useState } from 'react'
import { useRouter } from 'next/router'
import ProductCard from '../components/ProductCard'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function Home() {
  const [q, setQ] = useState('')
  const router = useRouter()
  const { data: products } = useSWR(() => `/api/products${q ? `?q=${encodeURIComponent(q)}` : ''}`, fetcher)

  function openProduct(id) {
    router.push(`/product/${id}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1929 0%, #152642 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(30, 58, 95, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              {process.env.NEXT_PUBLIC_SITE_NAME || 'Prima Store'}
            </h1>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 18,
              height: 18,
              color: '#b0b8c4'
            }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search products..."
              style={{
                padding: '12px 16px 12px 44px',
                width: 360,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
                color: '#ffffff',
                fontSize: 14,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#d4af37'
                e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.2)'
                e.target.style.background = 'rgba(255, 255, 255, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.boxShadow = 'none'
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>

          {/* Cart Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#d4af37',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 6,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(212, 175, 55, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {products ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24
          }}>
            {products.map(p => (
              <div
                key={p.id}
                onClick={() => openProduct(p.id)}
                style={{
                  cursor: 'pointer',
                  background: 'rgba(30, 58, 95, 0.6)',
                  borderRadius: 12,
                  padding: 16,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)'
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              >
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: 16
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <p style={{ color: '#b0b8c4', fontSize: 16 }}>Loading products...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(10, 25, 41, 0.9)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '40px 20px',
        marginTop: 60
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 40
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <h3 style={{ color: '#d4af37', margin: 0 }}>Prima Store</h3>
            </div>
            <p style={{ color: '#b0b8c4', lineHeight: 1.6 }}>
              Premium quality products with exceptional customer service. Your trusted shopping destination.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', marginBottom: 16 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['About Us', 'Contact', 'Shipping', 'Returns'].map(item => (
                <a key={item} href="#" style={{
                  color: '#b0b8c4',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#d4af37'}
                onMouseLeave={(e) => e.target.style.color = '#b0b8c4'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', marginBottom: 16 }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span style={{ color: '#b0b8c4' }}>+1 (555) 123-4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span style={{ color: '#b0b8c4' }}>support@primastore.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
