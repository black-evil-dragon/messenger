import axios from 'axios'
import { proxy } from '../../../package.json'

export const API_URL = proxy

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

api.interceptors.request.use( (config) => {
    config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    return config
})

export default api