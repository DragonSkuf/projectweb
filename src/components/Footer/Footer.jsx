import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()

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
              <span>SecureVPN</span>
            </Link>
            <p className="footer__tagline">{t('footer.tagline')}</p>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4>{t('footer.product')}</h4>
              <Link to="/#tariffs">{t('nav.tariffs')}</Link>
              <Link to="/#features">{t('nav.features')}</Link>
              <Link to="/#faq">{t('nav.faq')}</Link>
            </div>
            <div className="footer__col">
              <h4>{t('footer.company')}</h4>
              <a href="#">{t('footer.about')}</a>
              <a href="#">{t('footer.blog')}</a>
              <a href="#">{t('footer.careers')}</a>
            </div>
            <div className="footer__col">
              <h4>{t('footer.support')}</h4>
              <a href="#">{t('footer.help')}</a>
              <a href="#">{t('footer.contact')}</a>
              <a href="#">{t('footer.privacy')}</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} SecureVPN. {t('footer.rights')}</span>
          <div className="footer__bottom-links">
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
