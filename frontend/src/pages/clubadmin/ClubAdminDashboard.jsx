import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BarChart3, Plus, Loader2, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react'
import { eventService, clubService } from '../../services'
import { StatCard } from '../../components/StatCard'
import { StatusBadge } from '../../components/Badges'
import { SkeletonStats } from '../../components/Skeletons'
import { Modal } from '../../components/Modal'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const EMPTY_FORM = { title: '', description: '', date: '', maxParticipants: 30, clubId: '' }

export default function ClubAdminDashboard() {
  const { user } = useAuthStore()
  const [events,     setEvents]     = useState([])
  const [myClubs,    setMyClubs]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      // Load all clubs and filter ones where this user is the admin
      const [eventsRes, clubsRes] = await Promise.allSettled([
        eventService.getAll({ page: 1, limit: 100 }),
        clubService.getAll({ page: 1, limit: 50 }),
      ])

      const allClubs = clubsRes.status === 'fulfilled' ? (clubsRes.value.data ?? []) : []
      const adminClubs = allClubs.filter(c => c.adminId === user?.id)
      setMyClubs(adminClubs)

      // Auto-select first club
      if (adminClubs.length > 0 && !form.clubId) {
        setForm(f => ({ ...f, clubId: String(adminClubs[0].id) }))
      }

      const allEvents = eventsRes.status === 'fulfilled' ? (eventsRes.value.data ?? []) : []
      const mine = allEvents.filter(e => e.createdBy === user?.id)
      setEvents(mine)
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [user])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.clubId) { toast.error('Please select a club'); return }

    setSaving(true)
    try {
      const isoDate = new Date(form.date).toISOString()
      await eventService.create({
        title:           form.title,
        description:     form.description,
        date:            isoDate,
        maxParticipants: Number(form.maxParticipants),
        clubId:          Number(form.clubId),
      })
      toast.success('Event created — pending admin approval ✅')
      setShowCreate(false)
      setForm(EMPTY_FORM)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create event')
    } finally {
      setSaving(false)
    }
  }

  const pending  = events.filter(e => e.status === 'PENDING').length
  const approved = events.filter(e => e.status === 'APPROVED').length
  const ongoing  = events.filter(e => e.status === 'ONGOING').length

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Club Admin <span className="text-gradient">Dashboard</span></h1>
          <p className="page-subtitle">Manage your events and members</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* My Clubs chips */}
      {myClubs.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Your clubs:</span>
          {myClubs.map(c => (
            <span key={c.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-300 font-medium">
              <Building2 size={11} /> {c.name}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      {loading ? <SkeletonStats count={4} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Calendar}    label="Total Events"     value={events.length} color="primary" delay={0} />
          <StatCard icon={Clock}       label="Pending Approval" value={pending}       color="amber"   delay={0.1} />
          <StatCard icon={CheckCircle} label="Approved"         value={approved}      color="green"   delay={0.2} />
          <StatCard icon={BarChart3}   label="Ongoing"          value={ongoing}       color="blue"    delay={0.3} />
        </div>
      )}

      {/* Events table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-800">
          <h2 className="font-semibold text-slate-200">My Events</h2>
        </div>
        <table className="w-full">
          <thead className="table-head">
            <tr>
              <th className="table-th">Title</th>
              <th className="table-th">Date</th>
              <th className="table-th">Venue</th>
              <th className="table-th">Participants</th>
              <th className="table-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="table-row">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="table-td"><div className="skeleton h-4 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-td text-center py-12 text-slate-500">
                  No events yet. Create your first event!
                </td>
              </tr>
            ) : events.map((ev) => (
              <motion.tr key={ev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                <td className="table-td font-medium text-slate-200">{ev.title}</td>
                <td className="table-td">{formatDate(ev.date_ofEvent ?? ev.date)}</td>
                <td className="table-td text-slate-400">{ev.venue ?? '—'}</td>
                <td className="table-td">{ev.maxParticipants}</td>
                <td className="table-td"><StatusBadge status={ev.status} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Create Event Modal ──────────────────────────── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Event" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Club selector */}
          <div>
            <label className="label">Club</label>
            {myClubs.length === 0 ? (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                You are not assigned as admin of any club. Ask the System Admin to assign you.
              </p>
            ) : (
              <select
                className="input"
                value={form.clubId}
                onChange={e => setForm({ ...form, clubId: e.target.value })}
                required
              >
                {myClubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="label">Event Title</label>
            <input
              className="input"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Hackathon 2025"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input h-20 resize-none"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the event…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.date}
                min={new Date().toISOString().slice(0, 16)}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Max Participants</label>
              <input
                type="number"
                min={5}
                max={1000}
                className="input"
                value={form.maxParticipants}
                onChange={e => setForm({ ...form, maxParticipants: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving || myClubs.length === 0} className="btn-primary">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Creating…' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '—' }
}
