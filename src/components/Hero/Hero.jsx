import { useLanguage } from '../../context/LanguageContext.jsx'
import VpnWidget from '../VpnWidget/VpnWidget.jsx'
import './Hero.css'

export default function Hero() {
  const { t } = useLanguage()

  const scrollToTariffs = () => {
    document.getElementById('tariffs')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home">
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            {t('hero.badge')}
          </div>

          <h1 className="hero__title">
            {t('hero.title').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>

          <p className="hero__subtitle">{t('hero.subtitle')}</p>

          <div className="hero__actions">
            <button className="hero__btn-primary" onClick={scrollToTariffs}>
              {t('hero.cta_primary')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button className="hero__btn-ghost" onClick={scrollToTariffs}>
              {t('hero.cta_secondary')}
            </button>
          </div>

          <div className="hero__divider" />

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">100+</span>
              <span className="hero__stat-label">{t('hero.stat_servers')}</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">50+</span>
              <span className="hero__stat-label">{t('hero.stat_countries')}</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">1M+</span>
              <span className="hero__stat-label">{t('hero.stat_users')}</span>
            </div>
          </div>
        </div>

        <div className="hero__widget-wrap">
          <VpnWidget />
        </div>
      </div>
    </section>
  )
}
