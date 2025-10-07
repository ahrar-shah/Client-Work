import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Cart() {
  const [cart, setCart] = useState([])
  const router = useRouter()

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(saved)
  }, [])

  function checkout() {
    localStorage.setItem('checkoutItem', JSON.stringify(cart))
    router.push('/checkout')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>Cart is empty</p>}
      {cart.map((p, i) => (
        <div key={i}>
          <h4>{p.name}</h4>
          <p>Rs. {p.price}</p>
        </div>
      ))}
      {cart.length > 0 && <button onClick={checkout}>Checkout</button>}
    </div>
  )
}
