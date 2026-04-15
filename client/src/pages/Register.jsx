import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [inputs, setInputs] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputs.username.trim() || !inputs.email.trim() || !inputs.password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    try {
      setLoading(true)
      setError(null)
      await register(inputs)
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth page">
      <div className="auth__bg" />
      <div className="auth__card animate-fadeInUp">
        <div className="auth__card-header">
          <div className="auth__icon auth__icon--register">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h1 className="auth__title">Join BlogSpace</h1>
          <p className="auth__subtitle">Create your account and start sharing stories</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {typeof error === 'string' ? error : 'An error occurred.'}
          </div>
        )}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              name="username"
              className="form-control"
              placeholder="Choose a username"
              value={inputs.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="your@email.com"
              value={inputs.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a strong password"
              value={inputs.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary auth__submit" disabled={loading}>
            {loading ? (
              <><span className="write__spinner" /> Creating account…</>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="auth__footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth__link">Sign in →</Link>
        </div>
      </div>
    </div>
  )
}
