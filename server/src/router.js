const { version, proxy } = require('../package.json');
const { slt } = require('./config/config').config

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { generateTokens, saveToken, removeToken } = require('./service/token');
const nanoid = require('nanoid').customAlphabet('1234567890', 10);

const getUserByLogin = (login) => {
    const db = low(adapter)
    const result = db.get('users').find({ userLogin: login }).value()
    return result
}


/* Router */

const homePage = (req, res) => {
    res.sendFile(__dirname + '/server.html')
}

const getUsers = (req, res) => {
    const db = low(adapter)
    let DB = db.get('users').value()

    res.json(DB)
    return
}

const getContacts = (req, res) => {
    const db = low(adapter)

    const { contactLogin, userLogin } = req.body

    const getContactsByTarget = db.get('users').find({ userLogin: contactLogin }).get('userData').get('contacts').find({ userLogin: userLogin }).value()
    const getContactsByUser = db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts').find({ userLogin: contactLogin }).value()

    let result
    if (getUserByLogin(contactLogin)) {
        if (!getContactsByTarget) {
            db.get('users').find({ userLogin: contactLogin }).get('userData').get('contacts').push({ userLogin: userLogin, friend: false }).write()
        }
        if (!getContactsByUser) {
            db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts').push({ userLogin: contactLogin, friend: false }).write()
        } else { result = 'Пользователь уже добавлен в контакты' }
    } else {
        result = 'NOT_FOUND'
    }
    res.send(result)
}

const removeContacts = (req, res) => {
    const db = low(adapter)

    const { contactLogin, userLogin } = req.body
    let result

    if (getUserByLogin(contactLogin)) {
        db.get('users').find({ userLogin: contactLogin }).get('userData').get('contacts').remove({ userLogin: userLogin }).write()
        db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts').remove({ userLogin: contactLogin }).write()
    } else { result = 'Error' }
    res.send(result)
}

const postUserData = (req, res) => {
    const db = low(adapter)

    const { userLogin } = req.body
    const getUserByLogin = db.get('users').find({ userLogin: userLogin }).value()
    const contacts = db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts').value()

    const user_data = {
        userLogin: getUserByLogin.userLogin,
        userName: getUserByLogin.userData.userName,
        url: getUserByLogin.userData.url,
        contacts: contacts
    }
    res.send(user_data)
    return user_data
}


const SignUp = (req, res) => {
    const db = low(adapter)
    const { userLogin, userName, userPassword } = req.body

    if (getUserByLogin(userLogin)) {
        const result = 'USER_ALREADY_CREATED'
        res.send(result)
    } else {
        const id = nanoid()
        const hashPassword = bcrypt.hashSync(userPassword, slt)

        db.get('users').push({
            ID: id,
            userLogin: userLogin,
            userPassword: hashPassword,
            userData: {
                userName: userName,
                status: false,
                url: `/${userLogin}`,
                contacts: [],
                chats: []
            }
        }).write()

        const getUserByLogin = db.get('users').find({ userLogin: userLogin }).value()
        const contacts = db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts').value()

        const user_data = {
            userLogin: getUserByLogin.userLogin,
            userName: getUserByLogin.userData.userName,
            url: getUserByLogin.userData.url,
            contacts: contacts
        }

        const tokens = generateTokens(user_data)
        saveToken(userLogin, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 5 }).json({ tokens, user_data })
        return
    }
}

const SignIn = (req, res) => { // Думаю надо переименовать в /login
    const db = low(adapter)

    const { userLogin, userPassword } = req.body
    const getUserByLogin = db.get('users').find({ userLogin: userLogin }).value()
    const contacts = db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts').value()

    const user_data = {
        userLogin: getUserByLogin.userLogin,
        userName: getUserByLogin.userData.userName,
        url: getUserByLogin.userData.url,
        contacts: contacts
    }
    let result = 'Авторизация прошла успешно'

    if (getUserByLogin) {
        const checkPassword = bcrypt.compareSync(userPassword, getUserByLogin.userPassword, function (res) { return res })

        if (!checkPassword) {
            result = 'Неправильный логин или пароль'
        }
    } else {
        result = 'Неправильный логин или пароль'
    }

    const tokens = generateTokens(user_data)
    saveToken(userLogin, tokens.refreshToken)

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 5 }).json({ tokens, user_data })
    return

}

const logout = (req, res) => {
    const { userLogin } = req.body
    const { refreshToken } = req.cookies

    removeToken(userLogin, refreshToken)
    res.clearCookie('refreshToken')
    res.send()
    return
}

const refresh = (req, res) => {
    const { refreshToken } = req.cookies
    const tokens = generateTokens(user_data)
    saveToken(userLogin, tokens.refreshToken)

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 5 }).json({ tokens, user_data })
    return
}


module.exports = {
    homePage,
    getUsers,
    getContacts,
    removeContacts,
    postUserData,
    SignUp,
    SignIn,
    logout,
    refresh
}

