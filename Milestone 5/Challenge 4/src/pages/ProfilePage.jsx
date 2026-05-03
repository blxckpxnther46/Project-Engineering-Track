import { useState, useEffect } from 'react'
import { getUser, updateUser } from '../services/api'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [form, setForm] = useState({ email: '', username: '', phone: '' })

  useEffect(() => {
    getUser(1)
      .then(data => {
        setUser(data)
        setForm({
          email: data.email || '',
          username: data.username || '',
          phone: data.phone || ''
        })
        setLoading(false)
      })
      .catch(err => {
        setError('Could not load profile: ' + err.message)
        setLoading(false)
      })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updated = await updateUser(1, form)
      setUser(updated)
      setSaveMsg('Profile saved!')
    } catch (err) {
      setSaveMsg('Save failed: ' + err.message)
    }

    setSaving(false)
  }

  if (loading) return <div className="animate-spin"/>
  if (error) return <div>{error}</div>

  return (
    <form onSubmit={handleSave}>
      <input
        value={form.email}
        onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
      />
      <button type="submit">{saving ? 'Saving...' : 'Save'}</button>
    </form>
  )
}