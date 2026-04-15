import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getImageUrl } from '../utils/imageHelper.js'
import './Navbar.css'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const categories = ['tech', 'science', 'food', 'travel', 'design']

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="10" fill="url(#grad1)"/>
              <path d="M8 22 L10 10 L16 18 L22 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c6ff7"/>
                  <stop offset="1" stopColor="#e85d9f"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar__logo-text">Blog<span className="gradient-text">Space</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          {categories.map(cat => (
            <Link key={cat} to={`/?cat=${cat}`} className="navbar__cat-link">
              {cat}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="navbar__actions">
          {currentUser ? (
            <>
              <Link to="/write" className="btn btn-primary navbar__write-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
                </svg>
                Write
              </Link>
              <div className="navbar__user">
                <div className="navbar__avatar">
                  {currentUser.img
                    ? <img src={getImageUrl(currentUser.img)} alt={currentUser.username} />
                    : <span>{currentUser.username?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div className="navbar__user-dropdown">
                  <span className="navbar__user-name">{currentUser.username}</span>
                  <Link to={`/?uid=${currentUser.id}`} className="navbar__dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    My Blogs
                  </Link>
                  <Link to={`/?likedBy=${currentUser.id}`} className="navbar__dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Liked Blogs
                  </Link>
                  <button className="navbar__dropdown-item" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span/><span/><span/>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <form className="navbar__mobile-search" onSubmit={handleSearch}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="navbar__mobile-cats">
          {categories.map(cat => (
            <Link key={cat} to={`/?cat=${cat}`} className="navbar__mobile-cat">{cat}</Link>
          ))}
        </div>
        {currentUser ? (
          <div className="navbar__mobile-actions">
            <Link to="/write" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>Write Post</Link>
            <Link to={`/?uid=${currentUser.id}`} className="btn btn-outline" style={{width:'100%', justifyContent:'center', marginTop: '0.5rem'}}>My Blogs</Link>
            <Link to={`/?likedBy=${currentUser.id}`} className="btn btn-outline" style={{width:'100%', justifyContent:'center', marginTop: '0.5rem', borderColor: 'var(--clr-accent2)', color: 'var(--clr-accent2)'}}>Liked Blogs</Link>
            <button className="btn btn-ghost" style={{width:'100%', justifyContent:'center', marginTop: '0.5rem'}} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navbar__mobile-actions">
            <Link to="/login" className="btn btn-ghost" style={{width:'100%', justifyContent:'center'}}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
