import { Link } from 'react-router-dom'
import moment from 'moment'
import { getImageUrl } from '../utils/imageHelper.js'
import './PostCard.css'

const CATEGORY_COLORS = {
  tech: 'primary',
  science: 'pink',
  food: 'primary',
  travel: 'pink',
  design: 'primary',
}

export default function PostCard({ post }) {
  const badgeColor = CATEGORY_COLORS[post.category?.toLowerCase()] || 'primary'
  
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }
  const excerpt = getText(post.desc).slice(0, 140)

  return (
    <Link to={`/post/${post.id}`} className="post-card card">
      <div className="post-card__img-wrap">
        {post.img ? (
          <img
            src={getImageUrl(post.img)}
            alt={post.title}
            className="post-card__img"
            loading="lazy"
          />
        ) : (
          <div className="post-card__img-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {post.category && (
          <span className={`post-card__badge badge badge-${badgeColor}`}>
            {post.category}
          </span>
        )}
      </div>
      <div className="post-card__body">
        <h2 className="post-card__title">{post.title}</h2>
        {excerpt && <p className="post-card__excerpt">{excerpt}…</p>}
        <div className="post-card__meta">
          <div className="post-card__author">
            <div className="post-card__avatar">
              {post.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <span>{post.username || 'Anonymous'}</span>
          </div>
          <div className="post-card__stats" style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--clr-text-faint)', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {post.views || 0}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {post.likeCount || 0}
            </span>
            <span className="post-card__date" style={{ marginLeft: 'auto' }}>
              {moment(post.date).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
