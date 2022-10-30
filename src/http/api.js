import axios from 'axios'


const API_URL = process.env.REACT_APP_PRODUCTION === ' true' ? process.env.REACT_APP_API_KEY : ''

const api = axios.create({
    withCredentials: true,
})

api.interceptors.request.use(config => {
    config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    return config
})

api.interceptors.response.use(config => {
    return config
}, async error => {
    console.warn(error.response);
    if (!error.response) return 401
    const originalRequest = error.config

    if (error.response.status === 401) {
        const response = await api.post(`${API_URL}/api/refresh`, { withCredentials: true })
        if (response.data !== '401C') {
            originalRequest.headers.Authorization = `Bearer ${response.data}`

            localStorage.setItem('token', response.data)
            return api.request(originalRequest)
        } else {
            return '401CE'
        }
    }
})

export default api
