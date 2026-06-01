import api from './api'

// Auth
export const authService = {
  register: (data) => api.post('/auth/signup', data),
  login:    (data) => api.post('/auth/signin', data),
}

// Departments
export const deptService = {
  getAll:   ()        => api.get('/department'),
  getById:  (id)      => api.get(`/department/${id}`),
  create:   (data)    => api.post('/department', data),
  update:   (id, data)=> api.put(`/department/${id}`, data),
  delete:   (id)      => api.delete(`/department/${id}`),
}

// Clubs
export const clubService = {
  getAll:   (params) => api.get('/club', { params }),
  getById:  (id)    => api.get(`/club/${id}`),
  create:   (data)  => api.post('/club', data),
  update:   (id, data) => api.put(`/club/${id}`, data),
  delete:   (id)    => api.delete(`/club/${id}`),
  updateAdmin: (id, adminId) => api.patch(`/club/${id}/admin`, { adminId }),
  getHistory:  (id) => api.get(`/club/${id}/history`),
}

// Club Membership
export const memberService = {
  join:           (clubId) => api.post(`/clubMembership/join/${clubId}`),
  leave:          (clubId) => api.post(`/clubMembership/leave/${clubId}`),
  removeMember:   (clubId, userId) => api.delete(`/clubMembership/remove/${clubId}/${userId}`),
  getClubMembers: (clubId) => api.get(`/clubMembership/members/${clubId}`),
  getMyClubs:     ()       => api.get('/clubMembership/userClubs/0'),
  getMembership:  (clubId) => api.get(`/clubMembership/club/${clubId}/membership`),
}

// Events
export const eventService = {
  getAll:         (params) => api.get('/events', { params }),
  getById:        (id)     => api.get(`/events/${id}`),
  getByClub:      (clubId) => api.get(`/events/${clubId}/club`),
  create:         (data)   => api.post('/events', data),
  update:         (id, data) => api.put(`/events/${id}`, data),
  updateStatus:   (id, status) => api.patch(`/events/${id}/status`, { status }),
  delete:         (id)     => api.delete(`/events/${id}`),
}

// Event Registrations
export const eventRegService = {
  register:           (data)    => api.post('/eventRegisteration', data),
  getForEvent:        (eventId) => api.get(`/eventRegisteration/${eventId}`),
  getMyRegistrations: ()        => api.get('/eventRegisteration/my'),
  unregister:         (regId)   => api.delete(`/eventRegisteration/${regId}`),
}

// Users
export const userService = {
  me:           ()       => api.get('/user/me'),
  getById:      (id)     => api.get(`/user/${id}`),
  getAll:       (params) => api.get('/user/all', { params }),
  update:       (data)   => api.put('/user/me', data),
  updateRole:   (id, role) => api.patch(`/user/${id}/role`, { role }),
  delete:       ()       => api.delete('/user/me/delete'),
  getPastClubs: (id)     => api.get(`/user/${id}/pastClub`),
}

// Waiting List
export const waitingListService = {
  getForClub: (clubId) => api.get(`/waitingList/club/${clubId}`),
  myEntry:    (clubId) => api.get(`/waitingList/club/${clubId}/user`),
}

// Club History
export const historyService = {
  getClubHistory: (clubId) => api.get(`/clubHistory/club/${clubId}`),
  getUserHistory: ()        => api.get('/clubHistory/user/history'),
}
