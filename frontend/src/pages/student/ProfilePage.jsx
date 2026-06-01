import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, BookOpen, Shield, Save, Loader2 } from 'lucide-react'
import { userService } from '../../services'
import { RoleBadge } from '../../components/Badges'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await userService.me()
        setForm({ name: data.name ?? '', email: data.email ?? '' })
      } catch { /* use store data */
        setForm({ name: user?.name ?? '', email: user?.email ?? '' })
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await userService.update({ name: form.name })
      updateUser({ name: data.name })
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update profile')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      {/* Avatar section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user?.name ?? '—'}</h2>
            <p className="text-slate-400 text-sm">{user?.email ?? '—'}</p>
            <div className="mt-2">
              <RoleBadge role={user?.role} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="font-semibold text-slate-200 mb-5">Edit Information</h3>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="skeleton h-10 rounded-xl" />
            <div className="skeleton h-10 rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="input pl-10"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  minLength={3}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="input pl-10 opacity-60 cursor-not-allowed"
                  value={form.email}
                  readOnly
                  title="Email cannot be changed"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="label">Role</label>
              <div className="relative">
                <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="input pl-10 opacity-60 cursor-not-allowed"
                  value={user?.role ?? '—'}
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
