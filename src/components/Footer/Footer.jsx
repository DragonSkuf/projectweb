import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  const [blogOpen, setBlogOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 6V12C3 16.97 7.02 21.61 12 23C16.98 21.61 21 16.97 21 12V6L12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>SecureNet</span>
            </Link>
            <p className="footer__tagline">{t('footer.tagline')}</p>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4>{t('footer.product')}</h4>
              <a href="/#tariffs">{t('nav.tariffs')}</a>
              <a href="/#features">{t('nav.features')}</a>
              <a href="/#faq">{t('nav.faq')}</a>
            </div>
            <div className="footer__col">
              <h4>{t('footer.company')}</h4>
              <button className="footer__blog-btn" onClick={() => setBlogOpen(true)}>
                {t('footer.blog')}
              </button>
            </div>
            <div className="footer__col">
              <h4>{t('footer.support')}</h4>
              <button className="footer__blog-btn" onClick={() => setSupportOpen(true)}>{t('footer.help')}</button>
              <button className="footer__blog-btn" onClick={() => setSupportOpen(true)}>{t('footer.contact')}</button>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">{t('footer.privacy')}</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} SecureNet. {t('footer.rights')}</span>
          <div className="footer__bottom-links">
            <a href="/terms" target="_blank" rel="noopener noreferrer">{t('footer.terms')}</a>
          </div>
        </div>
      </div>

      {supportOpen && (
        <div className="footer__blog-overlay" onClick={() => setSupportOpen(false)}>
          <div className="footer__blog-popup" onClick={e => e.stopPropagation()}>
            <button className="footer__blog-close" onClick={() => setSupportOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <h3 className="footer__blog-title">{t('footer.support')}</h3>
            <div className="footer__blog-socials">
              {/* TG bot */}
              <a href="#" className="footer__social footer__social--tg" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.13.58-.47.72-.95.45l-2.62-1.93-1.27 1.22c-.14.14-.26.26-.53.26l.19-2.69 4.84-4.37c.21-.19-.05-.29-.32-.1L7.7 14.47l-2.58-.81c-.56-.17-.57-.56.12-.83l10.07-3.88c.47-.17.88.11.73.85z"/>
                </svg>
                <span>{t('footer.support_tg')}</span>
              </a>
              {/* VK bot */}
              <a href="#" className="footer__social footer__social--vk" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.36h-1.6c-.6 0-.79-.48-1.87-1.57-1-.93-1.43-1.06-1.68-1.06-.34 0-.44.1-.44.57v1.43c0 .41-.13.65-1.2.65-1.77 0-3.73-1.07-5.11-3.07C4.83 9.82 4.43 8 4.43 7.6c0-.25.1-.48.57-.48h1.6c.43 0 .59.19.75.65.83 2.4 2.22 4.5 2.79 4.5.21 0 .31-.1.31-.65V9.87c-.07-1.17-.68-1.27-.68-1.69 0-.2.17-.41.44-.41h2.52c.36 0 .49.19.49.62v3.33c0 .37.17.5.27.5.21 0 .39-.13.78-.52 1.2-1.35 2.06-3.43 2.06-3.43.11-.25.31-.48.74-.48h1.6c.48 0 .59.25.48.62-.2 1-.2 1-1.94 3.38-.15.24-.22.35 0 .62.16.2.7.69 1.06 1.11.66.75 1.16 1.38 1.3 1.81.12.43-.11.65-.57.65z"/>
                </svg>
                <span>{t('footer.support_vk')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {blogOpen && (
        <div className="footer__blog-overlay" onClick={() => setBlogOpen(false)}>
          <div className="footer__blog-popup" onClick={e => e.stopPropagation()}>
            <button className="footer__blog-close" onClick={() => setBlogOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <h3 className="footer__blog-title">{t('footer.blog_popup_title')}</h3>
            <div className="footer__blog-socials">
              {/* VK */}
              <a href="#" className="footer__social footer__social--vk" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.36h-1.6c-.6 0-.79-.48-1.87-1.57-1-.93-1.43-1.06-1.68-1.06-.34 0-.44.1-.44.57v1.43c0 .41-.13.65-1.2.65-1.77 0-3.73-1.07-5.11-3.07C4.83 9.82 4.43 8 4.43 7.6c0-.25.1-.48.57-.48h1.6c.43 0 .59.19.75.65.83 2.4 2.22 4.5 2.79 4.5.21 0 .31-.1.31-.65V9.87c-.07-1.17-.68-1.27-.68-1.69 0-.2.17-.41.44-.41h2.52c.36 0 .49.19.49.62v3.33c0 .37.17.5.27.5.21 0 .39-.13.78-.52 1.2-1.35 2.06-3.43 2.06-3.43.11-.25.31-.48.74-.48h1.6c.48 0 .59.25.48.62-.2 1-.2 1-1.94 3.38-.15.24-.22.35 0 .62.16.2.7.69 1.06 1.11.66.75 1.16 1.38 1.3 1.81.12.43-.11.65-.57.65z"/>
                </svg>
                <span>ВКонтакте</span>
              </a>
              {/* Telegram */}
              <a href="#" className="footer__social footer__social--tg" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.13.58-.47.72-.95.45l-2.62-1.93-1.27 1.22c-.14.14-.26.26-.53.26l.19-2.69 4.84-4.37c.21-.19-.05-.29-.32-.1L7.7 14.47l-2.58-.81c-.56-.17-.57-.56.12-.83l10.07-3.88c.47-.17.88.11.73.85z"/>
                </svg>
                <span>Telegram</span>
              </a>
              {/* YouTube */}
              <a href="#" className="footer__social footer__social--yt" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.58 7.19c-.23-.87-.92-1.56-1.79-1.79C18.25 5 12 5 12 5s-6.25 0-7.79.4c-.87.23-1.56.92-1.79 1.79C2 8.73 2 12 2 12s0 3.27.42 4.81c.23.87.92 1.56 1.79 1.79C5.75 19 12 19 12 19s6.25 0 7.79-.4c.87-.23 1.56-.92 1.79-1.79C22 15.27 22 12 22 12s0-3.27-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
