import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Trash2, Loader2, Search, Users, UserCog } from 'lucide-react'
import api from '../../services/api'
import { ConfirmModal, Modal } from '../../components/Modal'
import toast from 'react-hot-toast'

export default function ClubManagementPage() {
  const [clubs,    setClubs]    = useState([])
  const [users,    setUsers]    = useState([])
  const [depts,    setDepts]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showAssign, setShowAssign] = useState(null) // club object
  const [confirm,  setConfirm]  = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    name: '', deptId: '', adminId: '', memberLimit: 30, description: ''
  })

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [clubsRes, usersRes, deptsRes] = await Promise.allSettled([
        api.get('/club', { params: { page: 1, limit: 50 } }),
        api.get('/user/all', { params: { page: 1, limit: 100 } }),
        api.get('/department'),
      ])
      setClubs(clubsRes.status  === 'fulfilled' ? (clubsRes.value.data  ?? []) : [])
      setUsers(usersRes.status  === 'fulfilled' ? (usersRes.value.data  ?? []) : [])
      setDepts(deptsRes.status  === 'fulfilled' ? (deptsRes.value.data  ?? []) : [])
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.post('/club', {
        name:        form.name,
        deptId:      Number(form.deptId),
        adminId:     Number(form.adminId),
        memberLimit: Number(form.memberLimit),
        description: form.description,
      })
      toast.success(`Club "${data.name}" created!`)
      setShowCreate(false)
      setForm({ name: '', deptId: '', adminId: '', memberLimit: 30, description: '' })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create club')
    } finally {
      setSaving(false)
    }
  }

  const handleAssignAdmin = async (clubId, newAdminId) => {
    setSaving(true)
    try {
      await api.patch(`/club/${clubId}/admin`, { adminId: Number(newAdminId) })
      toast.success('Club admin updated!')
      setShowAssign(null)
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to assign admin')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/club/${confirm.id}`)
      toast.success('Club deleted')
      setConfirm(null)
      setClubs(prev => prev.filter(c => c.id !== confirm.id))
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete club')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const getDeptName = (id) => depts.find(d => d.id === id)?.name ?? `Dept #${id}`
  const getUserName = (id) => users.find(u => u.id === id)?.name ?? `User #${id}`

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Club Management</h1>
          <p className="page-subtitle">Create clubs and assign administrators</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={16} /> New Club
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clubs…"
          className="input pl-10"
        />
      </div>

      {/* Club cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Building2 size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No clubs yet. Create your first club!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((club, i) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 hover:border-primary-700/40 transition-all duration-300 flex flex-col group"
            >
              {/* Icon + name */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-100 truncate">{club.name}</h3>
                  <p className="text-xs text-slate-500">{getDeptName(club.deptId)}</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">
                {club.description ?? 'No description provided.'}
              </p>

              <div className="space-y-1 text-xs text-slate-500 mb-4">
                <p className="flex items-center gap-1.5">
                  <Users size={11} /> Max {club.memberLimit} members
                </p>
                <p className="flex items-center gap-1.5">
                  <UserCog size={11} /> Admin: {getUserName(club.adminId)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAssign(club)}
                  className="btn-secondary btn-sm flex-1 justify-center"
                >
                  <UserCog size={13} /> Assign Admin
                </button>
                <button
                  onClick={() => setConfirm({ id: club.id, name: club.name })}
                  className="btn-danger btn-sm"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Create Club Modal ──────────────────────────── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Club" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Club Name</label>
              <input
                className="input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Coding Club"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="label">Department</label>
              <select
                className="input"
                value={form.deptId}
                onChange={e => setForm({ ...form, deptId: e.target.value })}
                required
              >
                <option value="">Select department…</option>
                {depts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Club Admin (User)</label>
              <select
                className="input"
                value={form.adminId}
                onChange={e => setForm({ ...form, adminId: e.target.value })}
                required
              >
                <option value="">Select admin…</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Member Limit</label>
              <input
                type="number"
                min={5}
                max={500}
                className="input"
                value={form.memberLimit}
                onChange={e => setForm({ ...form, memberLimit: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Description (optional)</label>
              <input
                className="input"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Short description…"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Creating…' : 'Create Club'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Assign Admin Modal ─────────────────────────── */}
      <Modal
        open={!!showAssign}
        onClose={() => setShowAssign(null)}
        title={`Assign Admin — ${showAssign?.name}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Select a user to become the club admin. They will gain <span className="text-cyan-400 font-medium">CLUB_ADMIN</span> privileges for this club.
          </p>
          <div>
            <label className="label">Select User</label>
            <select
              id="assign-admin-select"
              className="input"
              defaultValue={showAssign?.adminId ?? ''}
            >
              <option value="">Select user…</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.role} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAssign(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => {
                const sel = document.getElementById('assign-admin-select')
                if (sel?.value) handleAssignAdmin(showAssign.id, sel.value)
                else toast.error('Please select a user')
              }}
              disabled={saving}
              className="btn-primary"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Assigning…' : 'Assign Admin'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Club"
        message={`Delete "${confirm?.name}"? All members and events will also be removed.`}
      />
    </div>
  )
}
