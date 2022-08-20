const jwt = require('jsonwebtoken');
const { access_secret, refresh_secret, tokens } = require('../config/config').config
const { validateAccessToken } = require('../service/token')


const authMiddleware = req => {

    const authHeader = req.headers.authorization
    if (!authHeader) return 401

    const accessToken = authHeader.split(' ')[1]
    if (!accessToken) return 401

    const tokenData = validateAccessToken(accessToken)
    if (!tokenData) return 401

    req.user = tokenData
    return req
}

module.exports = { authMiddleware }