import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

// Auth pages
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import AllClubsPage     from './pages/student/AllClubsPage'
import MyClubsPage      from './pages/student/MyClubsPage'
import EventsPage       from './pages/student/EventsPage'
import MyEventsPage     from './pages/student/MyEventsPage'
import ProfilePage      from './pages/student/ProfilePage'

// Club Admin pages
import ClubAdminDashboard from './pages/clubadmin/ClubAdminDashboard'

// System Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'
import EventApprovalPage  from './pages/admin/EventApprovalPage'
import DepartmentsPage    from './pages/admin/DepartmentsPage'
import ClubManagementPage from './pages/admin/ClubManagementPage'

// Error / placeholder pages
import { UnauthorizedPage, NotFoundPage, ComingSoonPage } from './pages/ErrorPages'

export default function App() {
  return (
    <Routes>
      {/* ── Root redirect ─────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Guest-only routes (redirect to dashboard if logged in) ── */}
      <Route element={<GuestRoute />}>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Error pages (always accessible) ──────────────── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ── Protected dashboard routes ────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* Student */}
          <Route path="/student/dashboard"     element={<StudentDashboard />} />
          <Route path="/student/clubs"         element={<AllClubsPage />} />
          <Route path="/student/my-clubs"      element={<MyClubsPage />} />
          <Route path="/student/events"        element={<EventsPage />} />
          <Route path="/student/my-events"     element={<MyEventsPage />} />
          <Route path="/student/notifications" element={<ComingSoonPage title="Notifications" />} />
          <Route path="/student/profile"       element={<ProfilePage />} />

          {/* Club Admin */}
          <Route element={<ProtectedRoute allowedRoles={['CLUB_ADMIN', 'SYSTEM_ADMIN']} />}>
            <Route path="/club-admin/dashboard" element={<ClubAdminDashboard />} />
            <Route path="/club-admin/events"    element={<ComingSoonPage title="Manage Events" />} />
            <Route path="/club-admin/members"   element={<ComingSoonPage title="Manage Members" />} />
            <Route path="/club-admin/analytics" element={<ComingSoonPage title="Analytics" />} />
          </Route>

          {/* System Admin */}
          <Route element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']} />}>
            <Route path="/admin/dashboard"   element={<AdminDashboard />} />
            <Route path="/admin/users"       element={<UserManagementPage />} />
            <Route path="/admin/clubs"       element={<ClubManagementPage />} />
            <Route path="/admin/events"      element={<EventApprovalPage />} />
            <Route path="/admin/departments" element={<DepartmentsPage />} />
            <Route path="/admin/analytics"   element={<ComingSoonPage title="Platform Analytics" />} />
          </Route>

        </Route>
      </Route>

      {/* ── 404 ──────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
