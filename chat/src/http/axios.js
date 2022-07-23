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
    }
})



export default api

/*

const axios = require('axios');

const MAX_RETRY = 10;
let currentRetry = 0;

function successHandler() {
  console.log('Data is Ready');
}

function errorHandler() {
  if (currentRetry < MAX_RETRY) {
    currentRetry++;
    console.log('Retrying...');
    sendWithRetry();
  } else {
    console.log('Retried several times but still failed');
  }
}

function sendWithRetry() {
  axios.get('http://example.com')
    .then(successHandler).catch(errorHandler);
}

axios.interceptors.response.use(function (response) {
  if (response.data.metrics.length) {
    throw new axios.Cancel('Operation canceled by the user.');
  } else {
    return response;
  }
}, function (error) {
  return Promise.reject(error);
});

sendWithRetry();

*/