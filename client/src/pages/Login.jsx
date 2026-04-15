import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [inputs, setInputs] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputs.email.trim() || !inputs.password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    try {
      setLoading(true)
      setError(null)
      await login(inputs)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth page">
      <div className="auth__bg" />
      <div className="auth__card animate-fadeInUp">
        <div className="auth__card-header">
          <div className="auth__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h1 className="auth__title">Welcome Back</h1>
          <p className="auth__subtitle">Sign in to continue writing and reading</p>
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
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email address"
              value={inputs.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={inputs.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary auth__submit" disabled={loading}>
            {loading ? (
              <><span className="write__spinner" /> Signing in…</>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth__footer">
          <span>Don't have an account?</span>
          <Link to="/register" className="auth__link">Create one →</Link>
        </div>
      </div>
    </div>
  )
}
