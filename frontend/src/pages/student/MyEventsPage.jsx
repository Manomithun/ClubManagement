import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Building2, Users, Search,
  CheckCircle, XCircle, AlertCircle, Loader2,
  CalendarDays, Ticket, Trash2
} from 'lucide-react'
import { eventRegService } from '../../services'
import { StatusBadge } from '../../components/Badges'
import { ConfirmModal } from '../../components/Modal'
import toast from 'react-hot-toast'

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    })
  } catch { return '—' }
}

function formatTime(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

function isUpcoming(iso) {
  return iso && new Date(iso) > new Date()
}

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('all') // 'all' | 'upcoming' | 'past'
  const [search,        setSearch]        = useState('')
  const [confirm,       setConfirm]       = useState(null)  // { regId, eventTitle }
  const [cancelling,    setCancelling]    = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await eventRegService.getMyRegistrations()
      setRegistrations(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error('Failed to load your events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await eventRegService.unregister(confirm.regId)
      toast.success(`Unregistered from "${confirm.eventTitle}"`)
      setConfirm(null)
      setRegistrations(prev => prev.filter(r => r.id !== confirm.regId))
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to cancel registration')
    } finally {
      setCancelling(false)
    }
  }

  // Computed
  const upcoming = registrations.filter(r => isUpcoming(r.event?.date))
  const past     = registrations.filter(r => !isUpcoming(r.event?.date))

  const filtered = registrations
    .filter(r => {
      if (filter === 'upcoming') return isUpcoming(r.event?.date)
      if (filter === 'past')     return !isUpcoming(r.event?.date)
      return true
    })
    .filter(r => r.event?.title?.toLowerCase().includes(search.toLowerCase()))

  const FILTERS = [
    { key: 'all',      label: 'All',      count: registrations.length },
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { key: 'past',     label: 'Past',     count: past.length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">My Events</h1>
        <p className="page-subtitle">Events you've registered for</p>
      </div>

      {/* Stats row */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Registered', value: registrations.length, icon: Ticket,       color: 'text-primary-400',  bg: 'bg-primary-500/10' },
            { label: 'Upcoming',         value: upcoming.length,       icon: CalendarDays, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Past Events',      value: past.length,           icon: Clock,        color: 'text-slate-400',   bg: 'bg-surface-700' },
          ].map(s => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-surface-900 border border-surface-800 rounded-xl p-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === f.key
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                filter === f.key ? 'bg-white/20' : 'bg-surface-700 text-slate-500'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events…"
            className="input pl-9 text-sm w-56"
          />
        </div>
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card p-16 text-center"
          >
            <Calendar size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">
              {search ? 'No events match your search.' : `No ${filter === 'all' ? '' : filter} events found.`}
            </p>
            {!search && filter === 'all' && (
              <a href="/student/events" className="btn-primary mt-4 inline-flex">
                Browse Events
              </a>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${filter}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((reg, i) => {
              const ev      = reg.event
              const coming  = isUpcoming(ev?.date)
              return (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card p-5 flex flex-col group transition-all duration-300 hover:border-primary-700/40 ${
                    !coming ? 'opacity-70' : ''
                  }`}
                >
                  {/* Status strip */}
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={ev?.status ?? 'PENDING'} />
                    {coming ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <CheckCircle size={11} /> Upcoming
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={11} /> Past
                      </span>
                    )}
                  </div>

                  {/* Event title */}
                  <h3 className="font-semibold text-slate-100 mb-1 line-clamp-2 leading-snug">
                    {ev?.title ?? 'Event'}
                  </h3>

                  {ev?.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {ev.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-1.5 flex-1 mb-4">
                    <p className="flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays size={12} className="text-primary-400 flex-shrink-0" />
                      {formatDate(ev?.date)} at {formatTime(ev?.date)}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-slate-400">
                      <Building2 size={12} className="text-violet-400 flex-shrink-0" />
                      {ev?.club?.name ?? 'Unknown Club'}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-slate-400">
                      <Users size={12} className="text-cyan-400 flex-shrink-0" />
                      Max {ev?.maxParticipants ?? '—'} participants
                    </p>
                  </div>

                  {/* Registration ID */}
                  <p className="text-xs text-slate-600 mb-3">
                    Registration #{reg.id}
                  </p>

                  {/* Cancel button — only for upcoming events */}
                  {coming && (
                    <button
                      onClick={() => setConfirm({ regId: reg.id, eventTitle: ev?.title })}
                      className="btn-sm w-full justify-center text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-xl px-3 py-2 flex items-center gap-1.5"
                    >
                      <Trash2 size={13} /> Cancel Registration
                    </button>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirm */}
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Cancel Registration"
        message={`Cancel your registration for "${confirm?.eventTitle}"? This cannot be undone.`}
      />
    </div>
  )
}
