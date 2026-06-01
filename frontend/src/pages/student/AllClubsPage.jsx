import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Building2, Users, Filter, Loader2 } from 'lucide-react'
import { clubService, memberService } from '../../services'
import { SkeletonCard } from '../../components/Skeletons'
import toast from 'react-hot-toast'

export default function AllClubsPage() {
  const [clubs,   setClubs]   = useState([])
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(null)

  const fetchClubs = async () => {
    setLoading(true)
    try {
      const { data } = await clubService.getAll({ page, limit: 12, search })
      setClubs(data ?? [])
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchClubs() }, [page, search])

  const handleJoin = async (clubId) => {
    setJoining(clubId)
    try {
      const res = await memberService.join(clubId)
      const msg = res.data?.message ?? 'Successfully joined!'
      toast.success(msg)
      fetchClubs()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Could not join club'
      toast.error(msg)
    } finally {
      setJoining(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">All Clubs</h1>
          <p className="page-subtitle">Discover and join clubs that match your interests</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search clubs…"
          className="input pl-10"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : clubs.length === 0 ? (
        <div className="card p-16 text-center">
          <Building2 size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No clubs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club, i) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-6 hover:border-primary-700/40 transition-all duration-300 flex flex-col"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center mb-4">
                <Building2 size={20} className="text-white" />
              </div>

              <h3 className="font-semibold text-slate-100 mb-1">{club.name}</h3>
              <p className="text-sm text-slate-500 flex-1 line-clamp-2 mb-4">
                {club.description ?? 'No description provided.'}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <Users size={12} />
                <span>Max {club.memberLimit} members</span>
              </div>

              <button
                onClick={() => handleJoin(club.id)}
                disabled={joining === club.id}
                className="btn-primary btn-sm w-full justify-center"
              >
                {joining === club.id ? <Loader2 size={14} className="animate-spin" /> : null}
                {joining === club.id ? 'Joining…' : 'Join Club'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm">Previous</button>
        <span className="text-sm text-slate-400">Page {page}</span>
        <button disabled={clubs.length < 12} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm">Next</button>
      </div>
    </div>
  )
}
