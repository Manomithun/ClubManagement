import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Clock, LogOut, Loader2, Users,
  CheckCircle, History, CalendarDays, Search
} from 'lucide-react'
import { memberService, historyService } from '../../services'
import { ConfirmModal } from '../../components/Modal'
import toast from 'react-hot-toast'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MyClubsPage() {
  const [activeClubs,  setActiveClubs]  = useState([])
  const [history,      setHistory]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [tab,          setTab]          = useState('active') // 'active' | 'history'
  const [search,       setSearch]       = useState('')
  const [confirm,      setConfirm]      = useState(null)   // { clubId, clubName }
  const [leaving,      setLeaving]      = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [myClubsRes, histRes] = await Promise.allSettled([
        memberService.getMyClubs(),
        historyService.getUserHistory(),
      ])
      setActiveClubs(myClubsRes.status === 'fulfilled' ? (myClubsRes.value.data ?? []) : [])
      setHistory(histRes.status === 'fulfilled'    ? (histRes.value.data ?? [])    : [])
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleLeave = async () => {
    setLeaving(true)
    try {
      await memberService.leave(confirm.clubId)
      toast.success(`Left ${confirm.clubName}`)
      setConfirm(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to leave club')
    } finally {
      setLeaving(false)
    }
  }

  // Filter
  const filteredActive = activeClubs.filter(m =>
    m.club?.name?.toLowerCase().includes(search.toLowerCase())
  )
  const filteredHistory = history.filter(h =>
    h.club?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const TABS = [
    { key: 'active',  label: 'Active Clubs',  icon: CheckCircle, count: activeClubs.length },
    { key: 'history', label: 'Past Clubs',    icon: History,     count: history.length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">My Clubs</h1>
        <p className="page-subtitle">Clubs you've joined and your membership history</p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-surface-900 border border-surface-800 rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <t.icon size={14} />
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                tab === t.key ? 'bg-white/20 text-white' : 'bg-surface-700 text-slate-400'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clubs…"
            className="input pl-9 text-sm w-56"
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : tab === 'active' ? (

          /* ── Active Clubs ─────────────────────────────── */
          filteredActive.length === 0 ? (
            <motion.div
              key="empty-active"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="card p-16 text-center"
            >
              <Building2 size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">
                {search ? 'No clubs match your search.' : "You haven't joined any clubs yet."}
              </p>
              {!search && (
                <a href="/student/clubs" className="btn-primary mt-4 inline-flex">
                  Browse Clubs
                </a>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="active-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredActive.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5 flex flex-col hover:border-primary-700/40 transition-all duration-300 group"
                >
                  {/* Club icon + name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <Building2 size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-100 truncate">
                        {member.club?.name ?? 'Club'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {member.club?.description ?? 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 mb-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Users size={12} />
                      {member.club?.memberLimit ?? '—'} member limit
                    </p>
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Active member</span>
                    </p>
                  </div>

                  {/* Leave button */}
                  <button
                    onClick={() => setConfirm({ clubId: member.clubId ?? member.club?.id, clubName: member.club?.name })}
                    className="btn-danger btn-sm w-full justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <LogOut size={13} /> Leave Club
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )

        ) : (

          /* ── Past Clubs (History) ─────────────────────── */
          filteredHistory.length === 0 ? (
            <motion.div
              key="empty-history"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="card p-16 text-center"
            >
              <History size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">
                {search ? 'No past clubs match your search.' : 'No past club memberships.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="history-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredHistory.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-4 flex items-center gap-4 hover:border-surface-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate">{h.club?.name ?? 'Club'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays size={10} /> Joined {formatDate(h.joinedAt)}
                      </span>
                      {h.leftAt && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={10} /> Left {formatDate(h.leftAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  {h.leaveReason && (
                    <span className="text-xs text-slate-500 bg-surface-800 px-2 py-1 rounded-lg whitespace-nowrap">
                      {h.leaveReason.replace(/_/g, ' ')}
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Leave Confirm */}
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleLeave}
        loading={leaving}
        title="Leave Club"
        message={`Are you sure you want to leave "${confirm?.clubName}"? You'll need to rejoin if you change your mind.`}
      />
    </div>
  )
}
