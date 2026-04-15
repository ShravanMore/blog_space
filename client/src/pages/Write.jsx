import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { getImageUrl } from '../utils/imageHelper.js'
import moment from 'moment'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import './Write.css'

const CATEGORIES = ['tech', 'science', 'food', 'travel', 'design']

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

export default function Write() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchingPost, setFetchingPost] = useState(false)
  const fileRef = useRef()

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
  }, [currentUser, navigate])

  // Fetch post data if editing
  useEffect(() => {
    if (editId) {
      const fetchPost = async () => {
        try {
          setFetchingPost(true)
          const res = await api.get(`/api/posts/${editId}`)
          const post = res.data
          setTitle(post.title || '')
          setDesc(post.desc || '')
          setCategory(post.category || '')
          if (post.img) {
            setPreview(getImageUrl(post.img))
          }
        } catch {
          setError('Could not load post. It may not exist.')
        } finally {
          setFetchingPost(false)
        }
      }
      fetchPost()
    }
  }, [editId])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const removeImage = () => {
    setFile(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const uploadImage = async () => {
    if (!file) return null
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/api/uploads', formData)
    // Cloudinary returns an object with url property
    return res.data.url || res.data
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    if (!desc.trim()) { setError('Content is required.'); return }
    if (!category) { setError('Please select a category.'); return }

    try {
      setLoading(true)
      setError(null)

      let imgFilename = null
      if (file) {
        imgFilename = await uploadImage()
      }

      const payload = {
        title,
        desc,
        category,
        img: imgFilename || (preview && !preview.startsWith('blob:') ? preview : ''),
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
      }

      if (editId) {
        await api.put(`/api/posts/${editId}`, payload)
      } else {
        await api.post('/api/posts', payload)
      }

      navigate('/')
    } catch (err) {
      setError(err?.response?.data || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) return null

  return (
    <div className="write page">
      <div className="container write__container">
        <div className="write__header">
          <h1 className="write__heading">
            {editId ? 'Edit Your Post' : 'Create a New Post'}
          </h1>
          <p className="write__subtext">
            {editId ? 'Update your story below.' : 'Share your thoughts, ideas, and stories with the world.'}
          </p>
        </div>

        {fetchingPost ? (
          <div className="write__loading">
            <div className="skeleton" style={{height:'40px',width:'100%',marginBottom:'1rem'}} />
            <div className="skeleton" style={{height:'300px',width:'100%',marginBottom:'1rem'}} />
            <div className="skeleton" style={{height:'40px',width:'60%'}} />
          </div>
        ) : (
          <form className="write__form" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {typeof error === 'string' ? error : 'An error occurred.'}
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label htmlFor="write-title">Title</label>
              <input
                id="write-title"
                type="text"
                className="form-control write__title-input"
                placeholder="An amazing title for your post…"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Cover Image */}
            <div className="form-group">
              <label>Cover Image</label>
              <div className="write__image-area">
                {preview ? (
                  <div className="write__image-preview">
                    <img src={preview} alt="Preview" />
                    <button type="button" className="write__image-remove" onClick={removeImage}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="write__image-dropzone" htmlFor="write-file">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span className="write__dropzone-text">Click to upload a cover image</span>
                    <span className="write__dropzone-hint">JPG, PNG, GIF up to 5MB</span>
                  </label>
                )}
                <input
                  id="write-file"
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </div>
            </div>

            {/* Content */}
            <div className="form-group">
              <label>Content</label>
              <div className="write__editor-wrapper">
                <ReactQuill 
                  theme="snow" 
                  value={desc} 
                  onChange={setDesc} 
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <div className="write__categories">
                {CATEGORIES.map(cat => (
                  <button
                    type="button"
                    key={cat}
                    className={`write__cat-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="write__submit-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary write__submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="write__spinner" />
                    {editId ? 'Updating…' : 'Publishing…'}
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>
                    </svg>
                    {editId ? 'Update Post' : 'Publish Post'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
