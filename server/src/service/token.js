const jwt = require('jsonwebtoken');
const { access_secret, refresh_secret, tokens } = require('../config/config').config

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')



const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, access_secret, { expiresIn: '1h' })
    const refreshToken = jwt.sign(payload, refresh_secret, { expiresIn: '24h' })

    return {
        accessToken,
        refreshToken
    }

}

const saveToken = (userLogin, refreshToken) => {
    const db = low(adapter)

    const tokenData = db.get('users').find({refreshToken: refreshToken}).value()
    if(!tokenData){
        db.get('users').find({userLogin: userLogin}).set('refreshToken', refreshToken).write()
    }
}

const removeToken = (userLogin, refreshToken) => {
    const db = low(adapter)

    const refresh_token = {refreshToken: refreshToken}

    const tokenData = db.get('users').find(refresh_token).value()
    if(tokenData) {
        db.get('users').find({userLogin: userLogin}).unset(refresh_token).write()
    }
}


const validateAccessToken = (token) => {
    try {
        const tokenData = jwt.verify(token, access_secret)
        return tokenData
    } catch (error) {
        return null
    }
}

const validateRefreshToken = (token) => {
    try {
        const tokenData = jwt.verify(token, refresh_secret)
        return tokenData
    } catch (error) {
        return null
    }
}

const refreshThisToken = (refreshToken) => {
    const db = low(adapter)
    if(!refreshToken) {
        return 401
    }

    const tokenData = validateRefreshToken(refreshToken)
    const getToken = db.get('users').find({ refreshToken: refreshToken }).value()

    if(!tokenData || !getToken){
        return 401
    } else {
        return getToken
    }

}

module.exports = {
    saveToken,
    generateTokens,
    removeToken,
    refreshThisToken,
    validateAccessToken,
    validateRefreshToken
}