import axios from 'axios'

const axiosAPI = axios.create({
    withCredentials: true,
})


export default axiosAPI