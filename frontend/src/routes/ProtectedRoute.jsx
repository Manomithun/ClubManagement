import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, user } = useAuthStore()
  const location = window.location.pathname

  // Only redirect away from /login when already authenticated
  // Allow /register to always be accessible so users can create new accounts
  if (isAuthenticated && location === '/login') {
    const role = user?.role
    if (role === 'SYSTEM_ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (role === 'CLUB_ADMIN')   return <Navigate to="/club-admin/dashboard" replace />
    return <Navigate to="/student/dashboard" replace />
  }

  return <Outlet />
}
