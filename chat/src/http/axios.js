import axios from 'axios'



const api = axios.create({
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    return config
})

api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401) {
        try {
            const response = await api.post('/api/refresh', {withCredentials: true})

            localStorage.setItem('token', response.data.accessToken)
            return api.request(originalRequest)
        } catch (error) {
            console.error(error)
        }
    }
})

export default api