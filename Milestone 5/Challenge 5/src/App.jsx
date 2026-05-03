import { useState } from 'react'
import { submitBugReport } from './api'

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']
const COMPONENTS = ['Authentication', 'Dashboard', 'Billing', 'API', 'Notifications', 'Settings']

const EMPTY_FORM = {
  title: '',
  severity: '',
  component: '',
  description: '',
  steps: '',
  stepsCount: '',
}

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [submitted, setSubmitted] = useState([])
  const [successId, setSuccessId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((f) => ({ ...f, [name]: value }))

    // ✅ Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // ✅ FIXED VALIDATION
  const validate = (data) => {
    const errs = {}

    if (!data.title.trim()) errs.title = 'Title is required'
    if (!data.severity) errs.severity = 'Select severity'
    if (!data.component) errs.component = 'Select component'
    if (!data.description.trim()) errs.description = 'Description required'

    if (!data.steps.trim()) errs.steps = 'Steps required'

    if (!data.stepsCount || Number(data.stepsCount) <= 0) {
      errs.stepsCount = 'Must be greater than 0'
    }

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate(form)

    // ✅ STOP submission if errors
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setServerError(null)

    try {
      const result = await submitBugReport(form)

      setSuccessId(result.id)
      setSubmitted((prev) => [result, ...prev])

      // ✅ RESET FORM
      setForm(EMPTY_FORM)
      setErrors({})
    } catch (err) {
      // ✅ SHOW SERVER ERROR
      if (err.field) {
        setErrors({ [err.field]: err.message })
      } else {
        setServerError(err.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const sevClass = (s) =>
    ({ Critical: 'sev-critical', High: 'sev-high', Medium: 'sev-medium', Low: 'sev-low' }[s] ?? '')

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="badge">⬡ TrackFlow Internal Tools</div>
        <h1>Report a Bug</h1>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>

          {successId && (
            <div className="success">✓ Bug {successId} filed successfully!</div>
          )}

          {serverError && (
            <div className="error">{serverError}</div>
          )}

          <div className="form-group">
            <label>Bug Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              style={errors.title ? { borderColor: 'red' } : {}}
            />
            {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity *</label>
              <select name="severity" value={form.severity} onChange={handleChange}>
                <option value="">Select</option>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.severity && <p style={{ color: 'red' }}>{errors.severity}</p>}
            </div>

            <div className="form-group">
              <label>Component *</label>
              <select name="component" value={form.component} onChange={handleChange}>
                <option value="">Select</option>
                {COMPONENTS.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.component && <p style={{ color: 'red' }}>{errors.component}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
          </div>

          <div className="form-group">
            <label>Steps *</label>
            <textarea
              name="steps"
              value={form.steps}
              onChange={handleChange}
            />
            {errors.steps && <p style={{ color: 'red' }}>{errors.steps}</p>}
          </div>

          <div className="form-group">
            <label>No. of Steps *</label>
            <input
              type="number"
              name="stepsCount"
              value={form.stepsCount}
              onChange={handleChange}
              min="1"
            />
            {errors.stepsCount && <p style={{ color: 'red' }}>{errors.stepsCount}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Submitting…' : 'Submit Bug Report'}
          </button>
        </form>
      </div>
    </div>
  )
}