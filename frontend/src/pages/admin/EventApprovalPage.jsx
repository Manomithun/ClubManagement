import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { eventService } from '../../services'
import { StatusBadge } from '../../components/Badges'
import { SkeletonTable } from '../../components/Skeletons'
import toast from 'react-hot-toast'

export default function EventApprovalPage() {
  const [events,   setEvents]   = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [actionId, setActionId] = useState(null)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const { data } = await eventService.getAll({ page: 1, limit: 50, search })
      setEvents(data ?? [])
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEvents() }, [search])

  const updateStatus = async (id, status) => {
    setActionId(`${id}-${status}`)
    try {
      await eventService.updateStatus(id, status)
      toast.success(`Event ${status.toLowerCase()}`)
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e))
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update status')
    } finally { setActionId(null) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Event Approval</h1>
        <p className="page-subtitle">Review and approve or reject club events</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search events…" className="input pl-10" />
      </div>

      {/* Pending highlight */}
      <div className="flex gap-3">
        {['PENDING','APPROVED','REJECTED','ONGOING','COMPLETED'].map(s => (
          <span key={s} className="badge">
            {s}: {events.filter(e => e.status === s).length}
          </span>
        ))}
      </div>

      {loading ? <SkeletonTable rows={6} cols={5} /> : (
        <div className="table-wrapper">
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="table-th">Title</th>
                <th className="table-th">Date</th>
                <th className="table-th">Club</th>
                <th className="table-th">Status</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={5} className="table-td text-center py-12 text-slate-500">No events found</td></tr>
              ) : events.map((ev) => (
                <tr key={ev.id} className="table-row">
                  <td className="table-td font-medium text-slate-200">{ev.title}</td>
                  <td className="table-td text-slate-400">{formatDate(ev.date)}</td>
                  <td className="table-td text-slate-400">Club #{ev.clubId}</td>
                  <td className="table-td"><StatusBadge status={ev.status} /></td>
                  <td className="table-td">
                    {ev.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(ev.id, 'APPROVED')}
                          disabled={!!actionId}
                          className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          {actionId === `${ev.id}-APPROVED` ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(ev.id, 'REJECTED')}
                          disabled={!!actionId}
                          className="btn-danger btn-sm"
                        >
                          {actionId === `${ev.id}-REJECTED` ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                          Reject
                        </button>
                      </div>
                    )}
                    {ev.status !== 'PENDING' && (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
