import { useLanguage } from '../../context/LanguageContext.jsx'
import './Reviews.css'

const reviewKeys = [
  { key: 'r1', initials: 'AK' },
  { key: 'r2', initials: 'MC' },
  { key: 'r3', initials: 'DV' },
]

export default function Reviews() {
  const { t } = useLanguage()

  return (
    <section className="reviews">
      <div className="container">
        <div className="reviews__head">
          <h2 className="reviews__title">{t('reviews.title')}</h2>
          <p className="reviews__subtitle">{t('reviews.subtitle')}</p>
        </div>
        <div className="reviews__grid">
          {reviewKeys.map(({ key, initials }) => (
            <div key={key} className="reviews__card">
              <div className="reviews__stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="reviews__star">★</span>
                ))}
              </div>
              <p className="reviews__text">{t(`reviews.${key}_text`)}</p>
              <div className="reviews__author">
                <div className="reviews__avatar">{initials}</div>
                <div>
                  <div className="reviews__name">{t(`reviews.${key}_name`)}</div>
                  <div className="reviews__role">{t(`reviews.${key}_role`)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
