import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Trash2, Loader2, Search } from 'lucide-react'
import api from '../../services/api'
import { ConfirmModal, Modal } from '../../components/Modal'
import toast from 'react-hot-toast'

export default function DepartmentsPage() {
  const [depts,      setDepts]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName,    setNewName]    = useState('')
  const [saving,     setSaving]     = useState(false)
  const [confirm,    setConfirm]    = useState(null)
  const [deleting,   setDeleting]   = useState(false)

  const fetchDepts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/department')
      setDepts(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDepts() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      const { data } = await api.post('/department', { name: newName.trim() })
      toast.success(`Department "${data.name}" created!`)
      setShowCreate(false)
      setNewName('')
      fetchDepts()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create department')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/department/${confirm.id}`)
      toast.success('Department deleted')
      setConfirm(null)
      setDepts(prev => prev.filter(d => d.id !== confirm.id))
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = depts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage college departments ({depts.length} total)</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={16} /> New Department
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search departments…"
          className="input pl-10"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">
            {search ? 'No departments match your search.' : 'No departments yet. Create your first one!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 flex items-center justify-between hover:border-primary-700/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <BookOpen size={18} className="text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">{dept.name}</p>
                  <p className="text-xs text-slate-500">ID #{dept.id}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirm({ id: dept.id, name: dept.name })}
                className="btn-ghost btn-sm text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Department" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Department Name</label>
            <input
              className="input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Computer Science"
              required
              minLength={2}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Department"
        message={`Are you sure you want to delete "${confirm?.name}"? This cannot be undone.`}
      />
    </div>
  )
}
