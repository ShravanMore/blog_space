import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound page">
      <div className="notfound__bg" />
      <div className="notfound__content animate-fadeInUp">
        <span className="notfound__code gradient-text">404</span>
        <h1 className="notfound__title">Page Not Found</h1>
        <p className="notfound__text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
