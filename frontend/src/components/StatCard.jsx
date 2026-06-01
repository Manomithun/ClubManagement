import { motion } from 'framer-motion'

export function StatCard({ icon: Icon, label, value, color = 'primary', trend, delay = 0 }) {
  const colors = {
    primary: { bg: 'bg-primary-500/10', icon: 'text-primary-400', border: 'border-primary-500/20' },
    green:   { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-500/20' },
    amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   border: 'border-amber-500/20' },
    red:     { bg: 'bg-red-500/10',     icon: 'text-red-400',     border: 'border-red-500/20' },
    violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20' },
  }
  const c = colors[color] ?? colors.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`stat-card border ${c.border}`}
    >
      <div className={`${c.bg} rounded-xl p-3 flex-shrink-0`}>
        <Icon size={20} className={c.icon} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
          </p>
        )}
      </div>
    </motion.div>
  )
}
