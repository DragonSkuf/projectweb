import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import './Auth.css'

export default function Register() {
  const { signUp } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', login: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.login)
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
            <span>SecureVPN</span>
          </Link>
        </div>

        <h1 className="auth-card__title">{t('auth.register_title')}</h1>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">{t('auth.login_field')}</label>
            <input
              className="auth-input"
              type="text"
              name="login"
              placeholder={t('auth.login_placeholder')}
              value={form.login}
              onChange={handleChange}
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '...' : t('auth.register_btn')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.has_account')}{' '}
          <Link to="/login">{t('auth.sign_in')}</Link>
        </p>
      </div>
    </div>
  )
}
