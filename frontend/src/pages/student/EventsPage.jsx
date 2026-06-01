import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Search, Filter, Loader2, Clock, Users } from 'lucide-react'
import { eventService, eventRegService } from '../../services'
import { StatusBadge } from '../../components/Badges'
import { SkeletonCard } from '../../components/Skeletons'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const STATUS_FILTERS = ['', 'APPROVED', 'PENDING', 'ONGOING', 'COMPLETED']

export default function EventsPage() {
  const { user } = useAuthStore()
  const [events,    setEvents]    = useState([])
  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState('')
  const [page,      setPage]      = useState(1)
  const [loading,   setLoading]   = useState(true)
  const [registering, setRegistering] = useState(null)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const { data } = await eventService.getAll({ page, limit: 9, search, status })
      setEvents(data ?? [])
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEvents() }, [page, search, status])

  const handleRegister = async (eventId) => {
    setRegistering(eventId)
    try {
      await eventRegService.register({ userId: user.id, eventId })
      toast.success('Registered for event!')
      fetchEvents()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Registration failed')
    } finally {
      setRegistering(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Events</h1>
        <p className="page-subtitle">Browse and register for upcoming events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search events…" className="input pl-10" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="input max-w-xs">
          <option value="">All Statuses</option>
          {STATUS_FILTERS.filter(Boolean).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Events grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="card p-16 text-center">
          <Calendar size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev, i) => (
            <motion.div key={ev.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-6 hover:border-primary-700/40 transition-all duration-300 flex flex-col"
            >
              {/* Status chip */}
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={ev.status} />
                <span className="text-xs text-slate-500">{formatDate(ev.date)}</span>
              </div>

              <h3 className="font-semibold text-slate-100 mb-2">{ev.title}</h3>
              <p className="text-sm text-slate-500 flex-1 line-clamp-2 mb-4">
                {ev.description ?? 'No description provided.'}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Users size={12} /> Max {ev.maxParticipants}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(ev.date)}</span>
              </div>

              {ev.status === 'APPROVED' && (
                <button
                  onClick={() => handleRegister(ev.id)}
                  disabled={registering === ev.id}
                  className="btn-primary btn-sm w-full justify-center"
                >
                  {registering === ev.id ? <Loader2 size={14} className="animate-spin" /> : null}
                  {registering === ev.id ? 'Registering…' : 'Register'}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm">Previous</button>
        <span className="text-sm text-slate-400">Page {page}</span>
        <button disabled={events.length < 9} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm">Next</button>
      </div>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
