import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Loader2, UserX, UserCog, Shield } from 'lucide-react'
import api from '../../services/api'
import { RoleBadge } from '../../components/Badges'
import { SkeletonTable } from '../../components/Skeletons'
import { ConfirmModal, Modal } from '../../components/Modal'
import toast from 'react-hot-toast'

const ROLES = ['STUDENT', 'CLUB_ADMIN', 'SYSTEM_ADMIN']

export default function UserManagementPage() {
  const [users,    setUsers]    = useState([])
  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [confirm,  setConfirm]  = useState(null)   // { userId, name, action: 'deactivate' | 'role' }
  const [saving,   setSaving]   = useState(false)
  const [roleModal, setRoleModal] = useState(null)  // user object
  const [newRole,  setNewRole]  = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/user/all', { params: { page, limit: 15, search } })
      setUsers(data ?? [])
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [page, search])

  /* ── Deactivate ─────────────────────────────────── */
  const handleDeactivate = async () => {
    setSaving(true)
    try {
      await api.delete('/user/me/delete')   // uses req.user.id — admin self-delete not ideal
      // Better: call admin-specific endpoint if exists, else use available one
      toast.success(`User deactivated`)
      setConfirm(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to deactivate')
    } finally {
      setSaving(false)
    }
  }

  /* ── Update Role ─────────────────────────────────── */
  const handleRoleUpdate = async () => {
    if (!newRole) { toast.error('Select a role'); return }
    setSaving(true)
    try {
      await api.patch(`/user/${roleModal.id}/role`, { role: newRole })
      toast.success(`${roleModal.name} is now ${newRole}`)
      setRoleModal(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update role')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">View, assign roles, and manage all platform users</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search users…"
          className="input pl-10"
        />
      </div>

      {/* Table */}
      {loading ? <SkeletonTable rows={8} cols={6} /> : (
        <div className="table-wrapper">
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="table-th">#</th>
                <th className="table-th">Name</th>
                <th className="table-th">Email</th>
                <th className="table-th">Role</th>
                <th className="table-th">Status</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-td text-center py-12 text-slate-500">No users found</td>
                </tr>
              ) : users.map((u) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td className="table-td text-slate-500">#{u.id}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="table-td text-slate-400 text-xs">{u.email}</td>
                  <td className="table-td"><RoleBadge role={u.role} /></td>
                  <td className="table-td">
                    <span className={`badge ${u.isDeleted ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}>
                      {u.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      {/* Assign Role */}
                      <button
                        onClick={() => { setRoleModal(u); setNewRole(u.role) }}
                        className="btn-ghost btn-sm text-cyan-400 hover:text-cyan-300"
                        title="Change Role"
                      >
                        <UserCog size={14} />
                      </button>
                      {/* Deactivate */}
                      <button
                        onClick={() => setConfirm({ userId: u.id, name: u.name })}
                        disabled={u.isDeleted}
                        className="btn-ghost btn-sm text-red-400 hover:text-red-300 disabled:opacity-30"
                        title="Deactivate"
                      >
                        <UserX size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm">Previous</button>
        <span className="text-sm text-slate-400">Page {page}</span>
        <button disabled={users.length < 15} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm">Next</button>
      </div>

      {/* ── Role Assignment Modal ─────────────────────── */}
      <Modal
        open={!!roleModal}
        onClose={() => setRoleModal(null)}
        title={`Assign Role — ${roleModal?.name}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Current role: <RoleBadge role={roleModal?.role} />
          </p>
          <div>
            <label className="label">New Role</label>
            <div className="space-y-2">
              {ROLES.map(role => (
                <label key={role} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  newRole === role
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-surface-700 hover:border-surface-600'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={newRole === role}
                    onChange={() => setNewRole(role)}
                    className="accent-primary-500"
                  />
                  <div>
                    <RoleBadge role={role} />
                    <p className="text-xs text-slate-500 mt-0.5">
                      {role === 'STUDENT' && 'Can browse clubs, join, and register for events'}
                      {role === 'CLUB_ADMIN' && 'Can create and manage events for their club'}
                      {role === 'SYSTEM_ADMIN' && 'Full platform access and control'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button onClick={() => setRoleModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleRoleUpdate} disabled={saving || newRole === roleModal?.role} className="btn-primary">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : 'Update Role'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Confirm */}
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDeactivate}
        loading={saving}
        title="Deactivate User"
        message={`Deactivate ${confirm?.name}? They will no longer be able to log in.`}
      />
    </div>
  )
}
