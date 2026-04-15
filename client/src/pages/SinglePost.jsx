import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import moment from 'moment'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { getImageUrl } from '../utils/imageHelper.js'
import './SinglePost.css'

export default function SinglePost() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetch = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/posts/${id}`)
        setPost(res.data)
        // Increment View Count instantly on load in the background (prevent Strict Mode double-fire & spam refreshes)
        if (!sessionStorage.getItem(`viewed_${id}`)) {
          api.put(`/api/posts/${id}/view`).catch(e => console.error("Could not log view", e))
          sessionStorage.setItem(`viewed_${id}`, 'true')
        }

        // Fetch related posts based on category
        if (res.data.category) {
          const relatedRes = await api.get(`/api/posts`, { params: { cat: res.data.category } })
          const filtered = relatedRes.data.filter(p => p.id !== res.data.id).slice(0, 4)
          setRelatedPosts(filtered)
        }
      } catch (err) {
        setError('Post not found or failed to load.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      setDeleting(true)
      await api.delete(`/api/posts/${id}`)
      navigate('/')
    } catch (err) {
      alert('Failed to delete post.')
      setDeleting(false)
    }
  }

  const handleLike = async () => {
    if (!currentUser) return navigate('/login')
    try {
      setLikeLoading(true)
      const res = await api.post(`/api/posts/${id}/like`)
      // Update local state without refreshing page
      setPost(prev => ({
        ...prev,
        isLiked: res.data.isLiked,
        likeCount: res.data.isLiked ? prev.likeCount + 1 : prev.likeCount - 1
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setLikeLoading(false)
    }
  }

  const isOwner = currentUser && post && currentUser.id === post.uid

  if (loading) return (
    <div className="single-post page">
      <div className="container single-post__container">
        <div className="skeleton" style={{height:'50px', width:'70%', marginBottom:'1rem'}} />
        <div className="skeleton" style={{height:'20px', width:'40%', marginBottom:'2rem'}} />
        <div className="skeleton single-post__hero-skeleton" />
        <div style={{display:'flex', flexDirection:'column', gap:'0.75rem', marginTop:'2rem'}}>
          {[...Array(8)].map((_,i) => <div key={i} className="skeleton" style={{height:'16px', width: i%3===2?'60%':'100%'}} />)}
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="single-post page">
      <div className="container single-post__container">
        <div className="alert alert-error" style={{marginTop:'3rem'}}>{error}</div>
        <Link to="/" className="btn btn-ghost" style={{marginTop:'1rem'}}>← Back to Home</Link>
      </div>
    </div>
  )

  return (
    <div className="single-post page animate-fadeIn">
      {/* Hero banner */}
      <div className="single-post__hero">
        {post.img ? (
          <img src={getImageUrl(post.img)} alt={post.title} className="single-post__hero-img" />
        ) : (
          <div className="single-post__hero-placeholder" />
        )}
        <div className="single-post__hero-overlay" />
      </div>

      <div className="container single-post__layout">
        <div className="single-post__main">
          {/* Breadcrumb */}
          <nav className="single-post__breadcrumb">
            <Link to="/">Home</Link>
            {post.category && (
              <>
                <span>/</span>
                <Link to={`/?cat=${post.category}`}>{post.category}</Link>
              </>
            )}
            <span>/</span>
            <span className="single-post__breadcrumb-current">Post</span>
          </nav>

          {/* Header */}
          <header className="single-post__header">
            {post.category && (
              <span className="badge badge-primary">{post.category}</span>
            )}
            <h1 className="single-post__title">{post.title}</h1>

            <div className="single-post__meta">
              <div className="single-post__author">
                <div className="single-post__avatar">
                  {post.username?.[0]?.toUpperCase()}
                </div>
                <div className="single-post__author-info">
                  <span className="single-post__author-name">{post.username}</span>
                  <span className="single-post__date">
                    {post.date ? moment(post.date).format('MMMM D, YYYY') : 'No date'}
120
                    {' · '}
                    {Math.max(1, Math.ceil((post.desc?.length || 0) / 1000))} min read
                    {' · '}
                    {post.views || 0} views
                  </span>
                </div>
              </div>

              <div className="single-post__actions" style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {/* Like Button */}
                <button 
                  className={`btn ${post.isLiked ? 'btn-primary' : 'btn-ghost'}`} 
                  onClick={handleLike} 
                  disabled={likeLoading}
                  style={{ gap: '0.4rem', padding: '0.45rem 1rem' }}
                >
                  <svg viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {post.likeCount || 0}
                </button>

                {isOwner && (
                  <>
                    <Link to={`/write?edit=${post.id}`} className="btn btn-outline" style={{ padding: '0.45rem 1rem' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
                      </svg>
                      Edit
                    </Link>
                    <button className="btn btn-danger" onClick={handleDelete} disabled={deleting} style={{ padding: '0.45rem 1rem' }}>
                      {deleting ? '...' : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="divider" />
          </header>

          {/* Body */}
          <article className="single-post__body">
            <div
              className="single-post__content"
              dangerouslySetInnerHTML={{ __html: post.desc }}
            />
          </article>

          {/* Footer */}
          <div className="single-post__footer">
            <div className="divider" />
            <div className="single-post__footer-inner">
              <Link to="/" className="btn btn-ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back to all posts
              </Link>
              {post.category && (
                <Link to={`/?cat=${post.category}`} className="btn btn-outline">
                  More in {post.category}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="single-post__sidebar">
          <div className="sidebar-widget">
            <h3 className="sidebar-widget__title">Read Next</h3>
            {relatedPosts.length > 0 ? (
              <div className="sidebar-related">
                {relatedPosts.map(rp => (
                  <Link to={`/post/${rp.id}`} key={rp.id} className="sidebar-related__card">
                    {rp.img ? (
                      <img src={getImageUrl(rp.img)} alt={rp.title} className="sidebar-related__img" />
                    ) : (
                      <div className="sidebar-related__img-placeholder" />
                    )}
                    <div className="sidebar-related__info">
                      <h4>{rp.title}</h4>
                      <span>Read article →</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="sidebar-widget__empty">No related posts found.</p>
            )}
          </div>

          <div className="sidebar-widget">
             <h3 className="sidebar-widget__title">Tags</h3>
             <div className="sidebar-tags">
               {post.category && <Link to={`/?cat=${post.category}`} className="badge badge-primary">{post.category}</Link>}
               <Link to="/" className="badge">BlogSpace</Link>
               <Link to="/" className="badge">Article</Link>
               <Link to="/" className="badge">Writers</Link>
             </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
