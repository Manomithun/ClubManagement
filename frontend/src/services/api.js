import axios from 'axios'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message ?? 'Something went wrong'
    const status = err.response?.status

    if (status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    } else if (status !== 404 && status !== 409) {
      toast.error(msg)
    }

    return Promise.reject(err)
  }
)

export default api
