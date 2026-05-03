import { useState, useEffect } from 'react'
import { fetchOrders } from '../mockApi'

// Skeleton row
function SkeletonRow() {
  return (
    <tr>
      {[40, 130, 180, 90, 80, 90].map((w, i) => (
        <td key={i} style={{ padding: '16px 20px' }}>
          <div
            style={{
              width: w,
              height: 13,
              borderRadius: 6,
              background:
                'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }}
          />
        </td>
      ))}
    </tr>
  )
}

// Order row
function OrderRow({ order }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td style={{ padding: 15 }}>{order.id}</td>
      <td style={{ padding: 15 }}>{order.customer}</td>
      <td style={{ padding: 15 }}>{order.product}</td>
      <td style={{ padding: 15 }}>₹{order.amount}</td>
      <td style={{ padding: 15 }}>{order.status}</td>
      <td style={{ padding: 15 }}>{order.date}</td>
    </tr>
  )
}

// Empty state
function EmptyState() {
  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 50 }}>📭</div>
          <h2>No Orders Found</h2>
          <p style={{ color: 'gray' }}>
            There are currently no orders available. Try refreshing or check later.
          </p>
          <button
            style={{
              marginTop: 10,
              padding: '10px 20px',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}
          >
            Create Order
          </button>
        </div>
      </td>
    </tr>
  )
}

// Error state
function ErrorState({ message, onRetry }) {
  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 50 }}>⚠️</div>
          <h2>Failed to Load Orders</h2>
          <p style={{ color: 'gray' }}>{message}</p>
          <button
            onClick={onRetry}
            style={{
              marginTop: 10,
              padding: '10px 20px',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}
          >
            Retry
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrders = () => {
    setLoading(true)
    setError(null)

    fetchOrders()
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h1>Orders Dashboard</h1>

      <table width="100%" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {/* 🔥 ALL 4 STATES HANDLED HERE */}

          {loading && (
            <>
              {[...Array(6)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          )}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadOrders} />
          )}

          {!loading && !error && orders.length === 0 && <EmptyState />}

          {!loading &&
            !error &&
            orders.length > 0 &&
            orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
        </tbody>
      </table>
    </div>
  )
}