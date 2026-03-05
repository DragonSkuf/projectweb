import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { supabase } from '../lib/supabase.js'
import Header from '../components/Header/Header.jsx'
import Modal from '../components/Modal/Modal.jsx'
import './Admin.css'

/* ─── helpers ─── */
const emptyTariff = { name: '', price: '', devices_limit: '', speed_limit: '', data_count: '' }
const emptyServer = { country: '', city: '', ip_address: '', load: 0, is_active: true }

export default function Admin() {
  const { t } = useLanguage()
  const [tab, setTab] = useState('users')

  /* users */
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  /* tariffs */
  const [tariffs, setTariffs] = useState([])
  const [tariffsLoading, setTariffsLoading] = useState(false)
  const [tariffModal, setTariffModal] = useState(null) // null | 'create' | tariff obj
  const [tariffForm, setTariffForm] = useState(emptyTariff)

  /* servers */
  const [servers, setServers] = useState([])
  const [serversLoading, setServersLoading] = useState(false)
  const [serverModal, setServerModal] = useState(null)
  const [serverForm, setServerForm] = useState(emptyServer)

  /* confirm delete */
  const [deleteTarget, setDeleteTarget] = useState(null) // {table, id}

  /* load data on tab change */
  useEffect(() => {
    if (tab === 'users') loadUsers()
    if (tab === 'tariffs') loadTariffs()
    if (tab === 'servers') loadServers()
  }, [tab])

  const loadUsers = async () => {
    setUsersLoading(true)
    const { data } = await supabase.from('users').select('*, roles(name)').order('id')
    setUsers(data || [])
    setUsersLoading(false)
  }

  const loadTariffs = async () => {
    setTariffsLoading(true)
    const { data } = await supabase.from('tariffs').select('*').order('price')
    setTariffs(data || [])
    setTariffsLoading(false)
  }

  const loadServers = async () => {
    setServersLoading(true)
    const { data } = await supabase.from('servers').select('*').order('country')
    setServers(data || [])
    setServersLoading(false)
  }

  /* ─── TARIFF CRUD ─── */
  const openCreateTariff = () => { setTariffForm(emptyTariff); setTariffModal('create') }
  const openEditTariff = (t) => { setTariffForm({ ...t }); setTariffModal(t) }

  const saveTariff = async (e) => {
    e.preventDefault()
    const payload = {
      name: tariffForm.name,
      price: parseFloat(tariffForm.price),
      devices_limit: parseInt(tariffForm.devices_limit),
      speed_limit: tariffForm.speed_limit,
      data_count: tariffForm.data_count,
    }
    if (tariffModal === 'create') {
      await supabase.from('tariffs').insert(payload)
    } else {
      await supabase.from('tariffs').update(payload).eq('id', tariffModal.id)
    }
    setTariffModal(null)
    loadTariffs()
  }

  /* ─── SERVER CRUD ─── */
  const openCreateServer = () => { setServerForm(emptyServer); setServerModal('create') }
  const openEditServer = (s) => { setServerForm({ ...s }); setServerModal(s) }

  const saveServer = async (e) => {
    e.preventDefault()
    const payload = {
      country: serverForm.country,
      city: serverForm.city,
      ip_address: serverForm.ip_address,
      load: parseInt(serverForm.load),
      is_active: serverForm.is_active,
    }
    if (serverModal === 'create') {
      await supabase.from('servers').insert(payload)
    } else {
      await supabase.from('servers').update(payload).eq('id', serverModal.id)
    }
    setServerModal(null)
    loadServers()
  }

  /* ─── DELETE ─── */
  const confirmDelete = (table, id) => setDeleteTarget({ table, id })
  const handleDelete = async () => {
    await supabase.from(deleteTarget.table).delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    if (deleteTarget.table === 'tariffs') loadTariffs()
    if (deleteTarget.table === 'servers') loadServers()
    if (deleteTarget.table === 'users') loadUsers()
  }

  /* ─── USER ROLE EDIT ─── */
  const changeUserRole = async (userId, roleId) => {
    await supabase.from('users').update({ role_id: roleId }).eq('id', userId)
    loadUsers()
  }

  return (
    <div className="admin-page">
      <Header />

      <div className="admin-wrap container">
        {/* Sidebar tabs */}
        <aside className="admin-sidebar">
          <h2 className="admin-sidebar__title">{t('admin.title')}</h2>
          {['users', 'tariffs', 'servers'].map(key => (
            <button
              key={key}
              className={`admin-sidebar__link ${tab === key ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => setTab(key)}
            >
              {t(`admin.${key}`)}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="admin-main">

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className="admin-section">
              <div className="admin-section__head">
                <h3 className="admin-section__title">{t('admin.users')}</h3>
              </div>
              {usersLoading ? <div className="admin-spinner" /> : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.id')}</th>
                        <th>{t('admin.name')}</th>
                        <th>{t('admin.email')}</th>
                        <th>{t('admin.role')}</th>
                        <th>{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="admin-td-muted">{String(u.id).slice(0, 8)}…</td>
                          <td>{u.login}</td>
                          <td>{u.email}</td>
                          <td>
                            <select
                              className="admin-select"
                              value={u.role_id}
                              onChange={e => changeUserRole(u.id, parseInt(e.target.value))}
                            >
                              <option value={1}>Admin</option>
                              <option value={2}>User</option>
                            </select>
                          </td>
                          <td>
                            <button className="admin-btn-danger-sm" onClick={() => confirmDelete('users', u.id)}>
                              {t('admin.delete')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── TARIFFS ── */}
          {tab === 'tariffs' && (
            <div className="admin-section">
              <div className="admin-section__head">
                <h3 className="admin-section__title">{t('admin.tariffs')}</h3>
                <button className="admin-btn-primary" onClick={openCreateTariff}>{t('admin.add_tariff')}</button>
              </div>
              {tariffsLoading ? <div className="admin-spinner" /> : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.name')}</th>
                        <th>{t('admin.price')}</th>
                        <th>{t('admin.devices')}</th>
                        <th>{t('admin.speed')}</th>
                        <th>{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tariffs.map(tariff => (
                        <tr key={tariff.id}>
                          <td>{tariff.name}</td>
                          <td>{tariff.price}</td>
                          <td>{tariff.devices_limit}</td>
                          <td>{tariff.speed_limit}</td>
                          <td className="admin-td-actions">
                            <button className="admin-btn-outline-sm" onClick={() => openEditTariff(tariff)}>
                              {t('admin.edit')}
                            </button>
                            <button className="admin-btn-danger-sm" onClick={() => confirmDelete('tariffs', tariff.id)}>
                              {t('admin.delete')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SERVERS ── */}
          {tab === 'servers' && (
            <div className="admin-section">
              <div className="admin-section__head">
                <h3 className="admin-section__title">{t('admin.servers')}</h3>
                <button className="admin-btn-primary" onClick={openCreateServer}>{t('admin.add_server')}</button>
              </div>
              {serversLoading ? <div className="admin-spinner" /> : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.country')}</th>
                        <th>{t('admin.city')}</th>
                        <th>{t('admin.ip')}</th>
                        <th>{t('admin.load')}</th>
                        <th>{t('admin.active')}</th>
                        <th>{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map(s => (
                        <tr key={s.id}>
                          <td>{s.country}</td>
                          <td>{s.city}</td>
                          <td className="admin-td-mono">{s.ip_address}</td>
                          <td>
                            <div className="admin-load-bar">
                              <div className="admin-load-fill" style={{ width: `${s.load}%`, background: s.load > 80 ? 'var(--color-danger)' : s.load > 50 ? 'var(--color-warning)' : 'var(--color-success)' }} />
                            </div>
                            <span className="admin-load-text">{s.load}%</span>
                          </td>
                          <td>
                            <span className={`admin-badge ${s.is_active ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                              {s.is_active ? '●' : '○'}
                            </span>
                          </td>
                          <td className="admin-td-actions">
                            <button className="admin-btn-outline-sm" onClick={() => openEditServer(s)}>{t('admin.edit')}</button>
                            <button className="admin-btn-danger-sm" onClick={() => confirmDelete('servers', s.id)}>{t('admin.delete')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Tariff modal */}
      {tariffModal && (
        <Modal title={tariffModal === 'create' ? t('admin.add_tariff') : t('admin.edit')} onClose={() => setTariffModal(null)}>
          <form className="admin-form" onSubmit={saveTariff}>
            {[['name', t('admin.name')], ['price', t('admin.price')], ['devices_limit', t('admin.devices')], ['speed_limit', t('admin.speed')], ['data_count', 'Data']].map(([field, label]) => (
              <div className="admin-field" key={field}>
                <label className="admin-label">{label}</label>
                <input className="admin-input" value={tariffForm[field]} onChange={e => setTariffForm(f => ({ ...f, [field]: e.target.value }))} required />
              </div>
            ))}
            <div className="admin-form-actions">
              <button className="admin-btn-primary" type="submit">{t('admin.save')}</button>
              <button className="admin-btn-outline" type="button" onClick={() => setTariffModal(null)}>{t('admin.cancel')}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Server modal */}
      {serverModal && (
        <Modal title={serverModal === 'create' ? t('admin.add_server') : t('admin.edit')} onClose={() => setServerModal(null)}>
          <form className="admin-form" onSubmit={saveServer}>
            {[['country', t('admin.country')], ['city', t('admin.city')], ['ip_address', t('admin.ip')], ['load', t('admin.load')]].map(([field, label]) => (
              <div className="admin-field" key={field}>
                <label className="admin-label">{label}</label>
                <input className="admin-input" type={field === 'load' ? 'number' : 'text'} min={0} max={100} value={serverForm[field]} onChange={e => setServerForm(f => ({ ...f, [field]: e.target.value }))} required />
              </div>
            ))}
            <div className="admin-field">
              <label className="admin-label">{t('admin.active')}</label>
              <input type="checkbox" checked={serverForm.is_active} onChange={e => setServerForm(f => ({ ...f, is_active: e.target.checked }))} />
            </div>
            <div className="admin-form-actions">
              <button className="admin-btn-primary" type="submit">{t('admin.save')}</button>
              <button className="admin-btn-outline" type="button" onClick={() => setServerModal(null)}>{t('admin.cancel')}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal title={t('admin.confirm_delete')} onClose={() => setDeleteTarget(null)}>
          <div className="modal-confirm-actions">
            <button className="dashboard-btn-danger" onClick={handleDelete}>{t('dashboard.confirm')}</button>
            <button className="admin-btn-outline" onClick={() => setDeleteTarget(null)}>{t('admin.cancel')}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
