import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, Calendar, CheckCircle, XCircle, Loader2, Search, Shield, TrendingUp } from 'lucide-react'
import { userService, clubService, eventService } from '../../services'
import { StatCard } from '../../components/StatCard'
import { StatusBadge, RoleBadge } from '../../components/Badges'
import { SkeletonStats, SkeletonTable } from '../../components/Skeletons'
import { ConfirmModal } from '../../components/Modal'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [users,    setUsers]    = useState([])
  const [events,   setEvents]   = useState([])
  const [clubs,    setClubs]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [approving, setApproving] = useState(null)
  const [rejecting, setRejecting] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [u, e, c] = await Promise.allSettled([
          userService.getAll({ page: 1, limit: 5 }),
          eventService.getAll({ page: 1, limit: 10, status: 'PENDING' }),
          clubService.getAll({ page: 1, limit: 5 }),
        ])
        setUsers(u.status === 'fulfilled' ? (u.value.data ?? []) : [])
        setEvents(e.status === 'fulfilled' ? (e.value.data ?? []) : [])
        setClubs(c.status === 'fulfilled' ? (c.value.data ?? []) : [])
      } catch { /* handled */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleApprove = async (eventId) => {
    setApproving(eventId)
    try {
      await eventService.updateStatus(eventId, 'APPROVED')
      toast.success('Event approved!')
      setEvents(events.filter(e => e.id !== eventId))
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to approve')
    } finally { setApproving(null) }
  }

  const handleReject = async (eventId) => {
    setRejecting(eventId)
    try {
      await eventService.updateStatus(eventId, 'REJECTED')
      toast.success('Event rejected.')
      setEvents(events.filter(e => e.id !== eventId))
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to reject')
    } finally { setRejecting(null) }
  }

  const pendingEvents  = events.filter(e => e.status === 'PENDING').length
  const activeUsers    = users.filter(u => !u.isDeleted).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">System <span className="text-gradient">Admin Dashboard</span></h1>
        <p className="page-subtitle">Platform overview and management</p>
      </div>

      {/* Stats */}
      {loading ? <SkeletonStats count={4} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}      label="Total Users"      value={users.length}  color="primary" delay={0} />
          <StatCard icon={Building2}  label="Total Clubs"      value={clubs.length}  color="violet"  delay={0.1} />
          <StatCard icon={Calendar}   label="Pending Approval" value={pendingEvents} color="amber"   delay={0.2} />
          <StatCard icon={Shield}     label="Active Users"     value={activeUsers}   color="green"   delay={0.3} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Event Approvals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-800">
              <h2 className="font-semibold text-slate-200">Pending Event Approvals</h2>
            </div>
            <div className="divide-y divide-surface-800">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse flex gap-3">
                    <div className="skeleton flex-1 h-10 rounded" />
                  </div>
                ))
              ) : events.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <CheckCircle size={32} className="mx-auto mb-2 text-emerald-600" />
                  No pending approvals — all caught up!
                </div>
              ) : events.map((ev) => (
                <div key={ev.id} className="p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 text-sm">{ev.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(ev.date)} · Club #{ev.clubId}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(ev.id)}
                      disabled={approving === ev.id}
                      className="btn-sm btn bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500"
                    >
                      {approving === ev.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(ev.id)}
                      disabled={rejecting === ev.id}
                      className="btn-danger btn-sm"
                    >
                      {rejecting === ev.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-800">
              <h2 className="font-semibold text-slate-200">Recent Users</h2>
            </div>
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  <th className="table-th">Name</th>
                  <th className="table-th">Email</th>
                  <th className="table-th">Role</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="table-row">
                      {[1,2,3].map(j => <td key={j} className="table-td"><div className="skeleton h-4 rounded" /></td>)}
                    </tr>
                  ))
                ) : users.map((u) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-td font-medium text-slate-200">{u.name}</td>
                    <td className="table-td text-slate-400 text-xs">{u.email}</td>
                    <td className="table-td"><RoleBadge role={u.role} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Recent Clubs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-800">
            <h2 className="font-semibold text-slate-200">Clubs Overview</h2>
          </div>
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="table-th">Club Name</th>
                <th className="table-th">Dept ID</th>
                <th className="table-th">Member Limit</th>
                <th className="table-th">Admin ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-row"><td colSpan={4} className="table-td"><div className="skeleton h-4 rounded" /></td></tr>
              ) : clubs.map((c) => (
                <tr key={c.id} className="table-row">
                  <td className="table-td font-medium text-slate-200">{c.name}</td>
                  <td className="table-td">Dept #{c.deptId}</td>
                  <td className="table-td">{c.memberLimit}</td>
                  <td className="table-td">#{c.adminId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
