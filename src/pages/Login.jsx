import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import './Auth.css'

export default function Login() {
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />

      <div className="auth-card">
        <div className="auth-card__top">
          <Link to="/" className="auth-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 6V12C3 16.97 7.02 21.61 12 23C16.98 21.61 21 16.97 21 12V6L12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>SecureNet</span>
          </Link>
        </div>

        <h1 className="auth-card__title">{t('auth.login_title')}</h1>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">{t('auth.email')}</label>
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder={t('auth.email_placeholder')}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">{t('auth.password')}</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder={t('auth.password_placeholder')}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '...' : t('auth.login_btn')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.no_account')}{' '}
          <Link to="/register">{t('auth.sign_up')}</Link>
        </p>
      </div>
    </div>
  )
}
