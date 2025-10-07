import useSWR from 'swr'
import { useState } from 'react'
import { useRouter } from 'next/router'
import ProductCard from '../components/ProductCard'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function Home() {
  const [q, setQ] = useState('')
  const router = useRouter()
  const { data: products, error } = useSWR(() => `/api/products${q ? `?q=${encodeURIComponent(q)}` : ''}`, fetcher, {
    revalidateOnFocus: false
  })

  function openProduct(id) {
    router.push(`/product/${id}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      color: '#ffffff',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem 2rem',
        borderBottom: '2px solid #ff4444',
        boxShadow: '0 4px 20px rgba(255, 68, 68, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{
            margin: 0,
            color: '#ff4444',
            fontSize: '2rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.5em' }}>🏪</span>
            {process.env.NEXT_PUBLIC_SITE_NAME || 'Prima Store'}
          </h1>
          
          <div style={{ position: 'relative' }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="🔍 Search products..."
              style={{
                padding: '12px 16px 12px 45px',
                width: '320px',
                border: '2px solid #333',
                borderRadius: '25px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff4444'
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333'
                e.target.style.boxShadow = 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.2rem'
            }}>🔍</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
          background: 'rgba(30, 30, 30, 0.6)',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffa726' }}>
            <span>📊</span>
            <span>{products ? `${products.length} products found` : 'Loading...'}</span>
          </div>
          
          {q && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 68, 68, 0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #ff4444'
            }}>
              <span>🔍</span>
              <span>Searching: "{q}"</span>
              <button
                onClick={() => setQ('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4444',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {error ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#ff6b6b'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
            <h3 style={{ marginBottom: '1rem' }}>Failed to load products</h3>
            <p style={{ color: '#ccc' }}>Please check your connection and try again</p>
          </div>
        ) : !products ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            gap: '20px'
          }}>
            <div style={{ 
              fontSize: '3rem',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>⏳</div>
            <h3 style={{ color: '#ffa726' }}>Loading Products...</h3>
            <style jsx>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤷‍♂️</div>
            <h3 style={{ marginBottom: '1rem', color: '#ffa726' }}>No products found</h3>
            <p style={{ color: '#ccc' }}>
              {q ? `No products matching "${q}"` : 'No products available at the moment'}
            </p>
            {q && (
              <button
                onClick={() => setQ('')}
                style={{
                  background: 'linear-gradient(45deg, #ff4444, #ff6b6b)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  fontWeight: '600'
                }}
              >
                🔄 Clear Search
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}>
            {products.map(p => (
              <div
                key={p.id}
                onClick={() => openProduct(p.id)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 68, 68, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid #333',
          textAlign: 'center',
          color: '#888'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '1rem'
          }}>
            <span>🚀</span>
            <span>⭐</span>
            <span>🔥</span>
          </div>
          <p>© 2024 {process.env.NEXT_PUBLIC_SITE_NAME || 'Prima Store'}. All rights reserved.</p>
        </footer>
      </main>

      {/* Quick Actions Floating Button */}
      {products && products.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(45deg, #ff4444, #ff6b6b)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 8px 25px rgba(255, 68, 68, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 100
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        >
          ⬆️
        </div>
      )}
    </div>
  )
}
