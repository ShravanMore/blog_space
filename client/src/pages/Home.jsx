import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios.js'
import { getImageUrl } from '../utils/imageHelper.js'
import PostCard from '../components/PostCard.jsx'
import './Home.css'

const CATEGORIES = ['tech', 'science', 'food', 'travel', 'design']

const getText = (html) => {
  if (!html) return ""
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.body.textContent || ""
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()

  const cat = searchParams.get('cat')
  const search = searchParams.get('search')
  const uid = searchParams.get('uid')
  const likedBy = searchParams.get('likedBy')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = {}
        if (cat) params.cat = cat
        if (uid) params.uid = uid
        if (likedBy) params.likedBy = likedBy

        const res = await api.get('/api/posts', { params })
        let data = res.data
        if (search) {
          data = data.filter(p =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.desc?.toLowerCase().includes(search.toLowerCase())
          )
        }
        setPosts(data)
      } catch (err) {
        setError('Failed to load posts. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [cat, search, uid, likedBy])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="home page">
      {/* Hero */}
      {!cat && !search && !uid && !likedBy && (
        <section className="hero">
          <div className="hero__bg" />
          <div className="container hero__container">
            <div className="hero__content">
              <div className="hero__tag badge badge-primary">Welcome to BlogSpace</div>
              <h1 className="hero__title">
                Discover Stories That<br />
                <span className="gradient-text">Inspire & Inform</span>
              </h1>
              <p className="hero__subtitle">
                A modern platform for writers and readers. Share your thoughts, explore ideas,
                and connect through the power of words.
              </p>
              <div className="hero__actions">
                <Link to="/write" className="btn btn-primary hero__cta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
                  </svg>
                  Start Writing
                </Link>
                <a href="#posts" className="btn btn-ghost">Explore Posts</a>
              </div>
            </div>

            {/* Right side visual elements */}
            <div className="hero__visuals">
              <div className="hero__visual-bg-glow"></div>

              {/* Animated Editor Window */}
              <div className="hero__editor-window float-animation-slow">
                <div className="hero__editor-header">
                  <div className="hero__editor-dots">
                    <span className="dot" style={{background: '#ff5f56'}}></span>
                    <span className="dot" style={{background: '#ffbd2e'}}></span>
                    <span className="dot" style={{background: '#27c93f'}}></span>
                  </div>
                  <div className="hero__editor-title">new-post.md</div>
                </div>
                <div className="hero__editor-body font-mono">
                  <div className="hero__editor-line typing-1"># The Art of Storytelling</div>
                  <div className="hero__editor-line typing-2">Every great story starts with</div>
                  <div className="hero__editor-line typing-3">a simple idea, sparked by</div>
                  <div className="hero__editor-line typing-4">imagination and passion.<span className="hero__editor-cursor">|</span></div>
                </div>
              </div>
              
              <div className="hero__visual-card hero__visual-card--1">
                <div className="hero__visual-icon">🚀</div>
                <div className="hero__visual-info">
                  <h4>Trending Tech</h4>
                  <p>12k readers</p>
                </div>
              </div>
              
              <div className="hero__visual-card hero__visual-card--2">
                <div className="hero__visual-icon">✍️</div>
                <div className="hero__visual-info">
                  <h4>Published!</h4>
                  <p>Just now</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hero__scroll-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div className="home__filters container" id="posts">
        <div className="home__filter-group">
          <Link
            to="/"
            className={`home__filter-btn ${!cat ? 'active' : ''}`}
          >
            All
          </Link>
          {CATEGORIES.map(c => (
            <Link
              key={c}
              to={`/?cat=${c}`}
              className={`home__filter-btn ${cat === c ? 'active' : ''}`}
            >
              {c}
            </Link>
          ))}
        </div>
        {(cat || search || uid || likedBy) && (
          <div className="home__filter-info">
            {uid ? (
              <span><strong className="gradient-text">My Published Blogs</strong> — {posts.length} posts</span>
            ) : likedBy ? (
              <span><strong className="gradient-text" style={{ color: 'var(--clr-accent2)' }}>Liked Blogs</strong> — {posts.length} posts</span>
            ) : search ? (
              <span>Results for "<strong>{search}</strong>" — {posts.length} posts</span>
            ) : (
              <span>Category: <strong className="gradient-text">{cat}</strong> — {posts.length} posts</span>
            )}
            <Link to="/" className="home__clear-filter">✕ Clear</Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container home__content-area">
        {loading && (
          <div className="home__grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card card">
                <div className="skeleton" style={{height:'200px'}} />
                <div style={{padding:'1.25rem', display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                  <div className="skeleton" style={{height:'20px', width:'80%'}} />
                  <div className="skeleton" style={{height:'14px', width:'100%'}} />
                  <div className="skeleton" style={{height:'14px', width:'65%'}} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="home__error">
            <div className="alert alert-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="home__empty">
            <div className="home__empty-icon">{likedBy ? '💔' : '📝'}</div>
            <h2>No posts found</h2>
            <p>{likedBy ? 'You haven\'t liked any blogs yet!' : uid ? 'You haven\'t published any blogs yet!' : search ? `No results for "${search}"` : cat ? `No posts in "${cat}" yet.` : 'Be the first to publish!'}</p>
            <Link to={likedBy ? "/" : "/write"} className="btn btn-primary">{likedBy ? 'Explore Posts' : 'Write the first post'}</Link>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            {/* Featured Post */}
            {featured && !cat && !search && !uid && !likedBy && (
              <div className="home__featured">
                <Link to={`/post/${featured.id}`} className="featured-post card">
                  <div className="featured-post__img-wrap">
                    {featured.img ? (
                      <img src={getImageUrl(featured.img)} alt={featured.title} />
                    ) : (
                      <div className="featured-post__img-placeholder" />
                    )}
                    <div className="featured-post__overlay" />
                    <div className="featured-post__info">
                      {featured.category && (
                        <span className="badge badge-primary featured-post__badge">{featured.category}</span>
                      )}
                      <h2 className="featured-post__title">{featured.title}</h2>
                      <p className="featured-post__excerpt">
                        {getText(featured.desc).slice(0, 200)}…
                      </p>
                      <div className="featured-post__meta">
                        <div className="featured-post__author">
                          <div className="post-card__avatar" style={{width:'30px',height:'30px',fontSize:'0.75rem'}}>
                            {featured.username?.[0]?.toUpperCase()}
                          </div>
                          <span>{featured.username}</span>
                        </div>
                        <span className="featured-post__read">Read Article →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Posts Grid */}
            <div className="home__grid">
              {(!cat && !search && !uid && !likedBy ? rest : posts).map((post, i) => (
                <div key={post.id} style={{ animationDelay: `${i * 0.08}s` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="home__footer">
        <div className="container home__footer-inner">
          <div className="navbar__logo" style={{justifyContent:'center'}}>
            <div className="navbar__logo-icon" style={{width:'28px',height:'28px'}}>
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="10" fill="url(#g2)"/>
                <path d="M8 22 L10 10 L16 18 L22 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#7c6ff7"/>
                    <stop offset="1" stopColor="#e85d9f"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span style={{fontWeight:700,fontSize:'1.1rem',color:'var(--clr-white)'}}>Blog<span className="gradient-text">Space</span></span>
          </div>
          <p>© {new Date().getFullYear()} BlogSpace. Built with ❤️ for writers.</p>
          <div className="home__footer-links">
            {CATEGORIES.map(c => (
              <Link key={c} to={`/?cat=${c}`}>{c}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
