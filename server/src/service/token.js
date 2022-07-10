const jwt = require('jsonwebtoken');
const { access_secret, refresh_secret, tokens } = require('../config/config').config

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')



const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, access_secret, { expiresIn: '2m' })
    const refreshToken = jwt.sign(payload, refresh_secret, { expiresIn: '5m' })

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
    
}

const validateRefreshToken = (token) => {
    
}

module.exports = {
    saveToken,
    generateTokens,
    removeToken
}