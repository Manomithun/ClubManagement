export function StatusBadge({ status }) {
  const map = {
    PENDING:   'badge-pending',
    APPROVED:  'badge-approved',
    REJECTED:  'badge-rejected',
    ONGOING:   'badge-ongoing',
    COMPLETED: 'badge-completed',
  }
  return <span className={map[status] ?? 'badge bg-slate-700 text-slate-300'}>{status}</span>
}

export function RoleBadge({ role }) {
  const map = {
    STUDENT:      'badge-student',
    CLUB_ADMIN:   'badge-club-admin',
    SYSTEM_ADMIN: 'badge-system-admin',
  }
  const label = { STUDENT: 'Student', CLUB_ADMIN: 'Club Admin', SYSTEM_ADMIN: 'System Admin' }
  return <span className={map[role] ?? 'badge bg-slate-700 text-slate-300'}>{label[role] ?? role}</span>
}
