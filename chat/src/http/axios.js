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
        const response = await api.post('/api/refresh', { withCredentials: true })
        if (response.data !== '401C') {
            originalRequest.headers.Authorization = `Bearer ${response.data}`

            localStorage.setItem('token', response.data.accessToken)
            return api.request(originalRequest)
        } else {
            return '401C'
        }
    }})



export default api

/*

const originalRequest = error.config

    if (error.response.status === 401) {
        const response = await api.post('/api/refresh', { withCredentials: true })
        if (response.data !== '401C') {
            originalRequest.headers.Authorization = `Bearer ${response.data}`

            localStorage.setItem('token', response.data.accessToken)
            return api.request(originalRequest)
        } else {
            return '401C'
        }
    }

*/