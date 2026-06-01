import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Calendar, Bell, User,
  LogOut, Menu, X, ChevronRight, Shield, Building2,
  BookOpen, BarChart3,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const NAV = {
  STUDENT: [
    { to: '/student/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
    { to: '/student/clubs',         label: 'All Clubs',      icon: Building2 },
    { to: '/student/my-clubs',      label: 'My Clubs',       icon: Users },
    { to: '/student/events',        label: 'Events',         icon: Calendar },
    { to: '/student/my-events',     label: 'My Events',      icon: BookOpen },
    { to: '/student/notifications', label: 'Notifications',  icon: Bell },
    { to: '/student/profile',       label: 'Profile',        icon: User },
  ],
  CLUB_ADMIN: [
    { to: '/club-admin/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
    { to: '/club-admin/events',    label: 'Manage Events', icon: Calendar },
    { to: '/club-admin/members',   label: 'Members',       icon: Users },
    { to: '/club-admin/analytics', label: 'Analytics',     icon: BarChart3 },
    { to: '/student/profile',      label: 'Profile',       icon: User },
  ],
  SYSTEM_ADMIN: [
    { to: '/admin/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
    { to: '/admin/users',        label: 'Users',          icon: Users },
    { to: '/admin/clubs',        label: 'Clubs',          icon: Building2 },
    { to: '/admin/events',       label: 'Event Approval', icon: Calendar },
    { to: '/admin/departments',  label: 'Departments',    icon: BookOpen },
    { to: '/admin/analytics',    label: 'Analytics',      icon: BarChart3 },
  ],
}

const ROLE_LABEL = { STUDENT: 'Student', CLUB_ADMIN: 'Club Admin', SYSTEM_ADMIN: 'System Admin' }
const ROLE_COLOR = { STUDENT: 'text-violet-400', CLUB_ADMIN: 'text-cyan-400', SYSTEM_ADMIN: 'text-orange-400' }

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuthStore()
  const role     = user?.role ?? 'STUDENT'
  const navItems = NAV[role] ?? NAV.STUDENT

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-64 flex-shrink-0 bg-surface-900 border-r border-surface-800 flex flex-col z-20"
          >
            {/* Logo */}
            <div className="px-6 py-5 border-b border-surface-800">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold text-gradient">ClubHub</span>
              </Link>
            </div>

            {/* User pill */}
            <div className="px-4 py-4 border-b border-surface-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/60">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{user?.name ?? 'User'}</p>
                  <p className={`text-xs font-medium ${ROLE_COLOR[role]}`}>{ROLE_LABEL[role]}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => {
                const active = location.pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`sidebar-link ${active ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight size={14} className="text-primary-400" />}
                  </Link>
                )
              })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-surface-800">
              <button
                onClick={handleLogout}
                className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex-shrink-0 bg-surface-900/80 backdrop-blur-sm border-b border-surface-800 flex items-center px-4 gap-4 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-ghost p-2 rounded-lg"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex-1" />

          {/* Notification bell */}
          <Link to="/student/notifications" className="btn-ghost p-2 rounded-lg relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-surface-900" />
          </Link>

          {/* Avatar */}
          <Link
            to="/student/profile"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm hover:opacity-80 transition-opacity"
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
