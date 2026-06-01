import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <Lock size={36} className="text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">403 – Forbidden</h1>
        <p className="text-slate-400 mb-6">You don't have permission to access this page.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </motion.div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-8xl font-black text-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </motion.div>
    </div>
  )
}

export function ComingSoonPage({ title = 'Coming Soon' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-5xl mb-4">🚀</div>
      <h2 className="text-xl font-bold text-slate-200 mb-2">{title}</h2>
      <p className="text-slate-500 text-sm">This page is under construction.</p>
    </div>
  )
}
