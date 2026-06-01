import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Calendar, Building2, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import { clubService, eventService, memberService } from '../../services'
import { StatCard } from '../../components/StatCard'
import { StatusBadge } from '../../components/Badges'
import { SkeletonStats } from '../../components/Skeletons'
import useAuthStore from '../../store/authStore'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [clubs,   setClubs]   = useState([])
  const [events,  setEvents]  = useState([])
  const [myClubs, setMyClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [c, e, mc] = await Promise.allSettled([
          clubService.getAll({ page: 1, limit: 4 }),
          eventService.getAll({ page: 1, limit: 5, status: 'APPROVED' }),
          memberService.getMyClubs(),
        ])
        setClubs(c.status === 'fulfilled'  ? (c.value.data  ?? []) : [])
        setEvents(e.status === 'fulfilled' ? (e.value.data  ?? []) : [])
        setMyClubs(mc.status === 'fulfilled' ? (mc.value.data ?? []) : [])
      } catch { /* handled by interceptor */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title">
          Good {getGreeting()},{' '}
          <span className="text-gradient">{user?.name?.split(' ')[0] ?? 'Student'}</span> 👋
        </h1>
        <p className="page-subtitle mt-1">Here's what's happening with your clubs today.</p>
      </div>

      {/* Stats */}
      {loading ? <SkeletonStats count={4} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Building2} label="My Clubs"       value={myClubs.length}  color="primary" delay={0} />
          <StatCard icon={Calendar}  label="Upcoming Events" value={events.length}   color="blue"    delay={0.1} />
          <StatCard icon={Users}     label="Total Clubs"    value={clubs.length}    color="violet"  delay={0.2} />
          <StatCard icon={TrendingUp} label="Events Joined" value="—"               color="green"   delay={0.3} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-200">Upcoming Events</h2>
            <Link to="/student/events" className="text-primary-400 text-sm flex items-center gap-1 hover:text-primary-300">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            )) : events.length === 0 ? (
              <EmptyState label="No upcoming events" />
            ) : events.slice(0, 4).map((ev) => (
              <Link
                key={ev.id}
                to={`/student/events`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-primary-300 transition-colors">
                    {ev.title}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(ev.date)}</p>
                </div>
                <StatusBadge status={ev.status} />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* My Clubs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-200">My Clubs</h2>
            <Link to="/student/my-clubs" className="text-primary-400 text-sm flex items-center gap-1 hover:text-primary-300">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            )) : myClubs.length === 0 ? (
              <EmptyState label="You haven't joined any clubs yet" action={{ to: '/student/clubs', label: 'Browse Clubs' }} />
            ) : myClubs.slice(0, 4).map((m) => (
              <div key={m.clubId} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 size={16} className="text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{m.clubName}</p>
                  <p className="text-xs text-slate-500">Joined {formatDate(m.joinedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Discover Clubs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-200">Discover Clubs</h2>
          <Link to="/student/clubs" className="text-primary-400 text-sm flex items-center gap-1 hover:text-primary-300">
            Browse all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          )) : clubs.map((club, i) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 hover:border-primary-700/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center mb-3">
                <Building2 size={18} className="text-white" />
              </div>
              <h3 className="font-semibold text-slate-200 text-sm mb-1 group-hover:text-primary-300 transition-colors truncate">{club.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{club.description ?? 'No description'}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Users size={12} />
                <span>Limit: {club.memberLimit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function EmptyState({ label, action }) {
  return (
    <div className="py-8 text-center">
      <p className="text-slate-500 text-sm">{label}</p>
      {action && (
        <Link to={action.to} className="btn-primary btn-sm mt-3 inline-flex">
          {action.label}
        </Link>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
