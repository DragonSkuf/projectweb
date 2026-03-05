import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { supabase } from '../lib/supabase.js'
import Modal from '../components/Modal/Modal.jsx'
import Header from '../components/Header/Header.jsx'
import './Dashboard.css'

function generateAccessKey(userId) {
  if (!userId) return '————————————————————————————————'
  const clean = userId.replace(/-/g, '').toUpperCase()
  return clean.match(/.{1,4}/g).join('-')
}

export default function Dashboard() {
  const { user, profile, updateProfile, deleteAccount } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [tab, setTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ login: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const [subscription, setSubscription] = useState(null)
  const [connections, setConnections] = useState([])
  const [loadingSub, setLoadingSub] = useState(false)
  const [loadingConn, setLoadingConn] = useState(false)

  const accessKey = generateAccessKey(user?.id)

  useEffect(() => {
    if (profile) setEditForm({ login: profile.login || '', email: profile.email || '' })
  }, [profile])

  useEffect(() => {
    if (tab === 'subscription') fetchSubscription()
    if (tab === 'connections') fetchConnections()
  }, [tab])

  async function fetchSubscription() {
    setLoadingSub(true)
    const { data } = await supabase
      .from('subscriptions')
      .select('*, tariffs(name, price, devices_limit, speed_limit, data_count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    setSubscription(data)
    setLoadingSub(false)
  }

  async function fetchConnections() {
    setLoadingConn(true)
    const { data } = await supabase
      .from('connections')
      .select('*, servers(country, city)')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(20)
    setConnections(data || [])
    setLoadingConn(false)
  }

  const handleEditChange = (e) => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    const { error } = await updateProfile(editForm)
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setEditMode(false)
  }

  const handleDelete = async () => {
    await deleteAccount()
    navigate('/')
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(accessKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—'
  const formatBytes = (b) => b ? `${(b / 1024 / 1024).toFixed(1)} MB` : '0 MB'

  const getDaysLeft = (endDate) => {
    if (!endDate) return null
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-wrap container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__avatar">
            {profile?.login?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="dashboard-sidebar__name">{profile?.login || user?.email?.split('@')[0] || 'User'}</div>
          <div className="dashboard-sidebar__email">{profile?.email || user?.email || ''}</div>

          <nav className="dashboard-sidebar__nav">
            {['profile', 'subscription', 'connections'].map(t_key => (
              <button
                key={t_key}
                className={`dashboard-sidebar__link ${tab === t_key ? 'dashboard-sidebar__link--active' : ''}`}
                onClick={() => setTab(t_key)}
              >
                {t(`dashboard.${t_key}`)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="dashboard-main">

          {/* Profile tab */}
          {tab === 'profile' && (
            <div className="dashboard-section">
              <div className="dashboard-section__head">
                <h2 className="dashboard-section__title">{t('dashboard.profile')}</h2>
              </div>

              {/* Access key card */}
              <div className="dashboard-key-card">
                <div className="dashboard-key-card__top">
                  <div className="dashboard-key-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                  </div>
                  <div>
                    <div className="dashboard-key-card__label">{t('dashboard.access_key')}</div>
                    <div className="dashboard-key-card__hint">{t('dashboard.access_key_hint')}</div>
                  </div>
                </div>
                <div className="dashboard-key-card__body">
                  <code className="dashboard-key-value">{accessKey}</code>
                  <button className={`dashboard-key-copy ${copied ? 'dashboard-key-copy--copied' : ''}`} onClick={handleCopyKey}>
                    {copied ? t('dashboard.copied') : t('dashboard.copy')}
                  </button>
                </div>
              </div>

              {editMode ? (
                <form className="dashboard-form" onSubmit={handleSave}>
                  {saveError && <div className="dashboard-error">{saveError}</div>}
                  <div className="dashboard-field">
                    <label className="dashboard-label">{t('dashboard.login_label')}</label>
                    <input className="dashboard-input" name="login" value={editForm.login} onChange={handleEditChange} />
                  </div>
                  <div className="dashboard-field">
                    <label className="dashboard-label">{t('dashboard.email_label')}</label>
                    <input className="dashboard-input" name="email" type="email" value={editForm.email} onChange={handleEditChange} />
                  </div>
                  <div className="dashboard-form__actions">
                    <button className="dashboard-btn-primary" type="submit" disabled={saving}>
                      {saving ? '...' : t('dashboard.save')}
                    </button>
                    <button className="dashboard-btn-outline" type="button" onClick={() => setEditMode(false)}>
                      {t('dashboard.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="dashboard-profile-info">
                  <div className="dashboard-info-row">
                    <span className="dashboard-info-label">{t('dashboard.login_label')}</span>
                    <span className="dashboard-info-value">{profile?.login || user?.email?.split('@')[0] || '—'}</span>
                  </div>
                  <div className="dashboard-info-row">
                    <span className="dashboard-info-label">{t('dashboard.email_label')}</span>
                    <span className="dashboard-info-value">{profile?.email || user?.email || '—'}</span>
                  </div>
                  <div className="dashboard-info-row">
                    <span className="dashboard-info-label">{t('dashboard.role_label')}</span>
                    <span className="dashboard-info-value">{profile?.roles?.name || 'user'}</span>
                  </div>
                  <div className="dashboard-info-row">
                    <span className="dashboard-info-label">{t('dashboard.created_label')}</span>
                    <span className="dashboard-info-value">{formatDate(profile?.created_at || user?.created_at)}</span>
                  </div>
                </div>
              )}

              <div className="dashboard-danger-zone">
                <button className="dashboard-btn-danger" onClick={() => setShowDeleteModal(true)}>
                  {t('dashboard.delete_account')}
                </button>
                {!editMode && (
                  <button className="dashboard-btn-outline" onClick={() => setEditMode(true)}>
                    {t('dashboard.edit_profile')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Subscription tab */}
          {tab === 'subscription' && (
            <div className="dashboard-section">
              <div className="dashboard-section__head">
                <h2 className="dashboard-section__title">{t('dashboard.subscription')}</h2>
              </div>

              {loadingSub ? (
                <div className="dashboard-spinner" />
              ) : subscription ? (() => {
                const daysLeft = getDaysLeft(subscription.end_date)
                const totalDays = 30
                const pct = subscription.end_date ? Math.min(100, Math.round((daysLeft / totalDays) * 100)) : 100
                return (
                  <div className="dashboard-sub-card">
                    <div className="dashboard-sub-header">
                      <div>
                        <div className="dashboard-sub-plan">{subscription.tariffs?.name}</div>
                        <div className="dashboard-sub-price">
                          {subscription.tariffs?.price > 0
                            ? `${subscription.tariffs.price} ₽ / мес`
                            : t('dashboard.sub_free')}
                        </div>
                      </div>
                      <span className={`dashboard-sub-status dashboard-sub-status--${subscription.status}`}>
                        {subscription.status}
                      </span>
                    </div>

                    {/* Days remaining */}
                    {subscription.end_date && (
                      <div className="dashboard-sub-days">
                        <div className="dashboard-sub-days__top">
                          <span className="dashboard-sub-days__label">{t('dashboard.days_left')}</span>
                          <span className={`dashboard-sub-days__count ${daysLeft <= 5 ? 'dashboard-sub-days__count--warn' : ''}`}>
                            {daysLeft} {t('dashboard.days')}
                          </span>
                        </div>
                        <div className="dashboard-sub-days__bar">
                          <div
                            className={`dashboard-sub-days__fill ${daysLeft <= 5 ? 'dashboard-sub-days__fill--warn' : ''}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="dashboard-sub-days__dates">
                          <span>{formatDate(subscription.start_date)}</span>
                          <span>{formatDate(subscription.end_date)}</span>
                        </div>
                      </div>
                    )}

                    <div className="dashboard-sub-features">
                      <div className="dashboard-sub-feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                        </svg>
                        <span>{t('dashboard.sub_devices')}: <strong>{subscription.tariffs?.devices_limit}</strong></span>
                      </div>
                      <div className="dashboard-sub-feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        <span>{t('dashboard.sub_speed')}: <strong>{subscription.tariffs?.speed_limit || '—'}</strong></span>
                      </div>
                      <div className="dashboard-sub-feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                        </svg>
                        <span>Data: <strong>{subscription.tariffs?.data_count || '—'}</strong></span>
                      </div>
                    </div>

                    <div className="dashboard-sub-dates">
                      <div className="dashboard-info-row">
                        <span className="dashboard-info-label">{t('dashboard.sub_renew')}</span>
                        <span className="dashboard-info-value">{subscription.auto_renew ? '✓ Да' : '✗ Нет'}</span>
                      </div>
                    </div>
                  </div>
                )
              })() : (
                <div className="dashboard-empty-sub">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L3 6V12C3 16.97 7.02 21.61 12 23C16.98 21.61 21 16.97 21 12V6L12 2Z"/>
                  </svg>
                  <p>{t('dashboard.no_subscription')}</p>
                  <a href="/#tariffs" className="dashboard-btn-primary">{t('dashboard.choose_plan')}</a>
                </div>
              )}
            </div>
          )}

          {/* Connections tab */}
          {tab === 'connections' && (
            <div className="dashboard-section">
              <div className="dashboard-section__head">
                <h2 className="dashboard-section__title">{t('dashboard.connections')}</h2>
              </div>

              {loadingConn ? (
                <div className="dashboard-spinner" />
              ) : connections.length > 0 ? (
                <div className="dashboard-table-wrap">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>{t('dashboard.conn_server')}</th>
                        <th>{t('dashboard.conn_start')}</th>
                        <th>{t('dashboard.conn_end')}</th>
                        <th>{t('dashboard.conn_traffic')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connections.map(c => (
                        <tr key={c.id}>
                          <td>{c.servers ? `${c.servers.country}, ${c.servers.city}` : '—'}</td>
                          <td>{formatDate(c.start_time)}</td>
                          <td>{formatDate(c.end_time)}</td>
                          <td>{formatBytes(c.traffic_sent + c.traffic_recv)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="dashboard-empty">{t('dashboard.no_connections')}</div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Delete confirm modal */}
      {showDeleteModal && (
        <Modal title={t('dashboard.delete_account')} onClose={() => setShowDeleteModal(false)}>
          <p className="modal-confirm-text">{t('dashboard.delete_confirm')}</p>
          <div className="modal-confirm-actions">
            <button className="dashboard-btn-danger" onClick={handleDelete}>{t('dashboard.confirm')}</button>
            <button className="dashboard-btn-outline" onClick={() => setShowDeleteModal(false)}>{t('dashboard.cancel')}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
