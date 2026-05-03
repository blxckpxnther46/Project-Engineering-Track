import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories, addToCart } from '../services/api'

const enrich = (p) => ({
  ...p,
  type: ['API', 'Template', 'CLI Tool', 'SDK', 'Plugin'][p.id % 5],
  pricing: p.id % 3 === 0 ? 'free' : 'paid',
  stars: (3.5 + (p.id % 15) / 10).toFixed(1),
  downloads: Math.floor(p.id * 847 + 1200),
})

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cartMsg, setCartMsg] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    setLoading(true)

    getProducts()
      .then(data => {
        setProducts(data.map(enrich))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })

    getCategories()
      .then(data => setCategories(['all', ...data]))
      .catch(() => {})
  }, [])

  const handleAddToCart = (product) => {
    addToCart({
      userId: 1,
      date: new Date().toISOString(),
      products: [{ productId: product.id, quantity: 1 }],
    })
      .then(() => {
        setCart(prev => [...prev, product.id])
        setCartMsg(`Added "${product.title.slice(0, 25)}..."`)
        setTimeout(() => setCartMsg(''), 3000)
      })
      .catch(() => {
        setCartMsg('Failed to add to cart')
        setTimeout(() => setCartMsg(''), 3000)
      })
  }

  const filtered = products
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4 text-sm">{error}</div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Dev Tools</h1>
        <p className="text-gray-500 text-sm mt-1">APIs, templates, CLI tools and more — built by devs, for devs.</p>
      </div>

      {cartMsg && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg z-50">
          {cartMsg}
        </div>
      )}

      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search tools..."
        className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map(product => (
          <div key={product.id} className="border rounded-xl p-5 flex flex-col gap-3">
            <Link to={`/products/${product.id}`}>{product.title}</Link>

            <button
              onClick={() => handleAddToCart(product)}
              disabled={cart.includes(product.id)}
              className="bg-gray-900 text-white py-2 rounded-lg"
            >
              {cart.includes(product.id) ? '✓ In Cart' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}