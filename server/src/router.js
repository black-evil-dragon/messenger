const { version, proxy } = require('../package.json');
const { slt } = require('./config/config').config

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { generateTokens, saveToken, removeToken, refreshThisToken } = require('./service/token');
const { authMiddleware } = require('./middleware/auth');
const nanoid = require('nanoid').customAlphabet('1234567890', 10);

const getUserByLogin = (login) => {
    const db = low(adapter)
    const result = db.get('users').find({ userLogin: login }).value()
    return result
}

const getUserByMail = (mail) => {
    const db = low(adapter)
    const result = db.get('users').find({ userMail: mail }).value()
    return result
}




/* Router */

const homePage = (req, res) => {
    res.sendFile(__dirname + '/server.html')
}

const getUsers = (req, res, next) => {
    const db = low(adapter)

    const result = authMiddleware(req, res) // Я пробовал запихнуть его как middleware, но почему-то происходит бесконечная попытка отправить запрос, посмотрю позже

    if (result === 401) { return res.sendStatus(401) }

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
        userMail: getUserByLogin.userMail,
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
    const { userMail, userLogin, userName, userPassword } = req.body

    if (getUserByLogin(userLogin) || getUserByMail(userMail)) {
        const result = false
        res.send(result)
    } else {
        const id = nanoid()
        const hashPassword = bcrypt.hashSync(userPassword, slt)

        db.get('users').push({
            ID: id,
            userMail: userMail,
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

        const user_data = getUserData(userMail, 'mail')

        const tokens = generateTokens(user_data)
        saveToken(userLogin, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 5 }).sendStatus(200)
        return
    }
}

const SignIn = (req, res) => { // Думаю надо переименовать в /login
    const db = low(adapter)

    const { userMail, userPassword } = req.body
    const getUserByMail = db.get('users').find({ userMail: userMail }).value()
    const contacts = db.get('users').find({ userMail: userMail }).get('userData').get('contacts').value()

    const user_data = getUserData(userMail, 'mail')

    let response

    if (getUserByMail) {
        const checkPassword = bcrypt.compareSync(userPassword, getUserByMail.userPassword, function (res) { return res })

        if (!checkPassword) {
            response = false
        }
    } else {
        response = false
    }

    const tokens = generateTokens(user_data)
    response = true
    saveToken(user_data.userLogin, tokens.refreshToken)

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 5 }).json({tokens, user_data, response})
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

    const result = refreshThisToken(refreshToken)

    if (result === 401) {
        res.sendStatus(401)
    } else {
        res.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 5 }).json(result).send()
        return

    }
    res.send()
}


/* Other func-s */

const getUserData = (target, type) => {
    const db = low(adapter)

    if (type === 'token') {
        const user = db.get('users').find({ refreshToken: target }).value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts
        }
    }
    if (type === 'mail'){
        const user = db.get('users').find({ userMail: target }).value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts
        }
    }
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

