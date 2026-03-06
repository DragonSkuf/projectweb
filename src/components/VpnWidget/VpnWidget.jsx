import { useLanguage } from '../../context/LanguageContext.jsx'
import './VpnWidget.css'

export default function VpnWidget() {
  const { t } = useLanguage()

  return (
    <div className="vpn-widget">
      <div className="vpn-widget__header">
        <svg className="vpn-widget__lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
        <span>{t('widget.ip_hidden')}</span>
      </div>

      <div className="vpn-widget__identity">
        <div className="vpn-widget__avatar">U</div>
        <div className="vpn-widget__identity-info">
          <span className="vpn-widget__identity-name">SecureNet</span>
          <span className="vpn-widget__identity-status">{t('widget.protected')}</span>
        </div>
        <div className="vpn-widget__dot" />
      </div>

      <div className="vpn-widget__rows">
        <div className="vpn-widget__row">
          <div className="vpn-widget__row-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>{t('widget.encryption')}</span>
          </div>
          <span className="vpn-widget__badge vpn-widget__badge--active">{t('widget.active')}</span>
        </div>

        <div className="vpn-widget__row">
          <div className="vpn-widget__row-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>{t('widget.speed')}</span>
          </div>
          <span className="vpn-widget__value">950 Mbps</span>
        </div>

        <div className="vpn-widget__row">
          <div className="vpn-widget__row-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>{t('widget.nologs')}</span>
          </div>
          <span className="vpn-widget__value">{t('widget.verified')}</span>
        </div>
      </div>

      <div className="vpn-widget__connected">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        {t('widget.connected')}
      </div>
    </div>
  )
}
