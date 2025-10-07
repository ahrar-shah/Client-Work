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
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>{process.env.NEXT_PUBLIC_SITE_NAME || 'Prima Store'}</h1>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by name"
          style={{ padding: 8, width: 320 }}
        />
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {products
          ? products.map(p => (
              <div
                key={p.id}
                onClick={() => openProduct(p.id)}
                style={{ cursor: 'pointer' }}
              >
                <ProductCard p={p} />
              </div>
            ))
          : <p>Loading...</p>}
      </main>
    </div>
  )
}
