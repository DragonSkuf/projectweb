import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './FAQ.css'

const questions = ['q1', 'q2', 'q3', 'q4', 'q5']

export default function FAQ() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)

  const toggle = (i) => setOpen(open === i ? null : i)

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq__head">
          <h2 className="faq__title">{t('faq.title')}</h2>
          <p className="faq__subtitle">{t('faq.subtitle')}</p>
        </div>

        <div className="faq__list">
          {questions.map((q, i) => (
            <div
              key={q}
              className={`faq__item ${open === i ? 'faq__item--open' : ''}`}
            >
              <button className="faq__question" onClick={() => toggle(i)}>
                <span>{t(`faq.${q}`)}</span>
                <span className="faq__chevron">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>
              <div className="faq__answer">
                <p>{t(`faq.${q.replace('q', 'a')}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
