import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === id)
        setProduct(found)
      })
  }, [id])

  if (!product) return <p>Loading...</p>

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(product)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart')
  }

  function buyNow() {
    localStorage.setItem('checkoutItem', JSON.stringify([product]))
    router.push('/checkout')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{product.name}</h2>
      <img src={product.imageBase64} alt={product.name} style={{ maxWidth: 300 }} />
      <p>{product.description}</p>
      <h3>Rs. {product.price}</h3>
      <button onClick={addToCart}>Add to Cart</button>
      <button onClick={buyNow} style={{ marginLeft: 10 }}>Buy Now</button>
    </div>
  )
}
