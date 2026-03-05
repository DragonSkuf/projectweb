import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { supabase } from '../../lib/supabase.js'
import './PaymentModal.css'

function generateAccessKey(userId) {
  if (!userId) return ''
  const clean = userId.replace(/-/g, '').toUpperCase()
  return clean.match(/.{1,4}/g).join('-')
}

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export default function PaymentModal({ plan, onClose }) {
  const { user } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()

  const isFree = plan.price[lang] === '0'

  const [step, setStep] = useState('form') // form | loading | success
  const [form, setForm] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [insertError, setInsertError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'number') { setForm(f => ({ ...f, number: formatCardNumber(value) })); return }
    if (name === 'expiry') { setForm(f => ({ ...f, expiry: formatExpiry(value) })); return }
    if (name === 'cvv') { setForm(f => ({ ...f, cvv: value.replace(/\D/g, '').slice(0, 3) })); return }
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep('loading')

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      tariff_id: plan.dbId,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      auto_renew: true,
    })

    if (error) {
      setInsertError(error.message)
      setStep('form')
      return
    }

    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1800))
    setStep('success')
  }

  const accessKey = generateAccessKey(user?.id)

  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && step !== 'loading' && onClose()}>
      <div className="pm-card">

        {/* Form step */}
        {step === 'form' && (
          <>
            <div className="pm-header">
              <div>
                <div className="pm-title">{t('payment.title')}</div>
                <div className="pm-plan-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L3 6V12C3 16.97 7.02 21.61 12 23C16.98 21.61 21 16.97 21 12V6L12 2Z"/>
                  </svg>
                  {t(`tariffs.${plan.key}_name`)} — {plan.price[lang] === '0' ? t('dashboard.sub_free') : (lang === 'ru' ? `${plan.price[lang]} ₽/мес` : `$${plan.price[lang]}/mo`)}
                </div>
              </div>
              <button className="pm-close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {insertError && (
              <div className="pm-insert-error">{insertError}</div>
            )}

            {isFree ? (
              <form className="pm-form" onSubmit={handleSubmit}>
                <p className="pm-free-text">{t('payment.free_text')}</p>
                <button type="submit" className="pm-submit">{t('payment.free_submit')}</button>
              </form>
            ) : (
              <form className="pm-form" onSubmit={handleSubmit}>
                {/* Card preview */}
                <div className="pm-card-preview">
                  <div className="pm-card-preview__chip" />
                  <div className="pm-card-preview__number">
                    {form.number || '•••• •••• •••• ••••'}
                  </div>
                  <div className="pm-card-preview__bottom">
                    <span className="pm-card-preview__name">{form.name || 'CARDHOLDER NAME'}</span>
                    <span className="pm-card-preview__expiry">{form.expiry || 'MM/YY'}</span>
                  </div>
                </div>

                <div className="pm-field">
                  <label className="pm-label">{t('payment.card_number')}</label>
                  <input
                    className="pm-input"
                    name="number"
                    placeholder={t('payment.card_number_ph')}
                    value={form.number}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                  />
                </div>
                <div className="pm-field">
                  <label className="pm-label">{t('payment.card_name')}</label>
                  <input
                    className="pm-input"
                    name="name"
                    placeholder={t('payment.card_name_ph')}
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
                <div className="pm-row">
                  <div className="pm-field">
                    <label className="pm-label">{t('payment.card_expiry')}</label>
                    <input
                      className="pm-input"
                      name="expiry"
                      placeholder={t('payment.card_expiry_ph')}
                      value={form.expiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="pm-field">
                    <label className="pm-label">{t('payment.card_cvv')}</label>
                    <input
                      className="pm-input pm-input--cvv"
                      name="cvv"
                      placeholder={t('payment.card_cvv_ph')}
                      value={form.cvv}
                      onChange={handleChange}
                      required
                      inputMode="numeric"
                      type="password"
                    />
                  </div>
                </div>

                <button type="submit" className="pm-submit">{t('payment.submit')}</button>
              </form>
            )}
          </>
        )}

        {/* Loading step */}
        {step === 'loading' && (
          <div className="pm-loading">
            <div className="pm-loading__spinner" />
            <div className="pm-loading__text">{t('payment.processing')}</div>
            <div className="pm-loading__dots"><span/><span/><span/></div>
          </div>
        )}

        {/* Success step */}
        {step === 'success' && (
          <div className="pm-success">
            <div className="pm-success__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 className="pm-success__title">{t('payment.success_title')}</h2>
            <p className="pm-success__text">{t('payment.success_text')}</p>

            <div className="pm-success__key-wrap">
              <div className="pm-success__key-label">{t('payment.success_key_label')}</div>
              <code className="pm-success__key">{accessKey}</code>
            </div>

            <button
              className="pm-submit"
              onClick={() => { onClose(); navigate('/dashboard') }}
            >
              {t('payment.go_dashboard')}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
