import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import PaymentModal from '../PaymentModal/PaymentModal.jsx'
import './Tariffs.css'

const plans = [
  {
    key: 'basic',
    dbId: 1,
    price: { ru: '0', en: '0' },
    features: ['1', '100 Mbps', '3 GB/мес', 'No-Logs'],
    featuresEn: ['1', '100 Mbps', '3 GB/mo', 'No-Logs'],
    popular: false,
  },
  {
    key: 'pro',
    dbId: 2,
    price: { ru: '299', en: '3.99' },
    features: ['5', '950 Mbps', t => t('tariffs.unlimited'), 'No-Logs', 'Kill Switch', 'Priority Support'],
    featuresEn: ['5', '950 Mbps', 'Unlimited', 'No-Logs', 'Kill Switch', 'Priority Support'],
    popular: true,
  },
  {
    key: 'business',
    dbId: 3,
    price: { ru: '799', en: '9.99' },
    features: ['10', '950 Mbps', t => t('tariffs.unlimited'), 'No-Logs', 'Kill Switch', 'Dedicated IP', '24/7 Support'],
    featuresEn: ['10', '950 Mbps', 'Unlimited', 'No-Logs', 'Kill Switch', 'Dedicated IP', '24/7 Support'],
    popular: false,
  },
]

const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Tariffs() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleChoose = (plan) => {
    if (!user) {
      navigate('/register')
      return
    }
    setSelectedPlan(plan)
  }

  return (
    <section className="tariffs" id="tariffs">
      <div className="container">
        <div className="tariffs__head">
          <h2 className="tariffs__title">{t('tariffs.title')}</h2>
          <p className="tariffs__subtitle">{t('tariffs.subtitle')}</p>
        </div>

        <div className="tariffs__grid">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`tariffs__card ${plan.popular ? 'tariffs__card--popular' : ''}`}
            >
              {plan.popular && (
                <div className="tariffs__popular-badge">{t('tariffs.popular')}</div>
              )}
              <div className="tariffs__plan-name">{t(`tariffs.${plan.key}_name`)}</div>
              <div className="tariffs__plan-desc">{t(`tariffs.${plan.key}_desc`)}</div>

              <div className="tariffs__price-wrap">
                <span className="tariffs__currency">{lang === 'ru' ? '₽' : '$'}</span>
                <span className="tariffs__price">{plan.price[lang]}</span>
                <span className="tariffs__period">{t('tariffs.per_month')}</span>
              </div>

              <ul className="tariffs__features">
                {(lang === 'ru' ? plan.features : plan.featuresEn).map((f, i) => (
                  <li key={i} className="tariffs__feature">
                    <span className="tariffs__check">{checkIcon}</span>
                    <span>{typeof f === 'function' ? f(t) : f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`tariffs__btn ${plan.popular ? 'tariffs__btn--primary' : 'tariffs__btn--ghost'}`}
                onClick={() => handleChoose(plan)}
              >
                {t('tariffs.choose')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </section>
  )
}
