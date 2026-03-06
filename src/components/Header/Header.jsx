import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Header.css'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { lang, switchLang, t } = useLanguage()
  const { user, profile, signOut } = useAuth()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const langRef = useRef(null)
  const userRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="header">
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <svg className="header__logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 6V12C3 16.97 7.02 21.61 12 23C16.98 21.61 21 16.97 21 12V6L12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="header__logo-text">SecureNet</span>
        </Link>

        {/* Nav */}
        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <button className="header__nav-link" onClick={() => scrollTo('home')}>{t('nav.home')}</button>
          <button className="header__nav-link" onClick={() => scrollTo('tariffs')}>{t('nav.tariffs')}</button>
          <button className="header__nav-link" onClick={() => scrollTo('features')}>{t('nav.features')}</button>
          <button className="header__nav-link" onClick={() => scrollTo('faq')}>{t('nav.faq')}</button>
        </nav>

        {/* Right controls */}
        <div className="header__controls">
          {/* Language */}
          <div className="header__lang" ref={langRef}>
            <button className="header__icon-btn" onClick={() => setLangOpen(o => !o)} aria-label="Language">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                <path d="M2 12h20"/>
              </svg>
            </button>
            {langOpen && (
              <div className="header__lang-dropdown">
                <button
                  className={`header__lang-option ${lang === 'ru' ? 'header__lang-option--active' : ''}`}
                  onClick={() => { switchLang('ru'); setLangOpen(false) }}
                >
                  <span className="header__lang-flag">🇷🇺</span>
                  {t('lang.ru')}
                </button>
                <button
                  className={`header__lang-option ${lang === 'en' ? 'header__lang-option--active' : ''}`}
                  onClick={() => { switchLang('en'); setLangOpen(false) }}
                >
                  <span className="header__lang-flag">🇺🇸</span>
                  {t('lang.en')}
                </button>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button className="header__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* Auth buttons */}
          {user ? (
            <div className="header__user" ref={userRef}>
              <button className="header__user-btn" onClick={() => setUserOpen(o => !o)}>
                <div className="header__user-avatar">
                  {profile?.login?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="header__user-name">{profile?.login || profile?.email?.split('@')[0]}</span>
                <svg className="header__user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {userOpen && (
                <div className="header__user-dropdown">
                  <Link to="/dashboard" className="header__user-option" onClick={() => setUserOpen(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    {t('nav.dashboard')}
                  </Link>
                  {profile?.role_id === 1 && (
                    <Link to="/admin" className="header__user-option" onClick={() => setUserOpen(false)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      {t('nav.admin')}
                    </Link>
                  )}
                  <div className="header__user-divider" />
                  <button className="header__user-option header__user-option--danger" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="header__btn-ghost">{t('nav.login')}</Link>
              <Link to="/register" className="header__btn-primary">{t('nav.start')}</Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button className="header__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
