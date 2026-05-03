import { useState, useEffect } from 'react'
import { getCart, getProduct, deleteCartItem } from '../services/api'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const carts = await getCart(1)

        if (!carts || carts.length === 0) {
          setCart({ products: [] })
          setLoading(false)
          return
        }

        const latest = carts[carts.length - 1]

        const productDetails = await Promise.all(
          latest.products.map(async item => {
            const p = await getProduct(item.productId)
            return { ...p, quantity: item.quantity }
          })
        )

        setCart({ ...latest, productDetails })
      } catch {
        setError('Could not load your cart')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleRemove = async (productId) => {
    setRemoving(productId)
    try {
      await deleteCartItem(cart.id)

      setCart(prev => ({
        ...prev,
        productDetails: prev.productDetails.filter(p => p.id !== productId)
      }))
    } catch (err) {
      alert('Remove failed: ' + err.message)
    }
    setRemoving(null)
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin"/></div>
  if (error) return <div>{error}</div>

  const items = cart?.productDetails || []

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.title}
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}