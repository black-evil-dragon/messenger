const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const { nanoid } = require('nanoid')

const { slt } = require('../config/config').config
const bcrypt = require('bcrypt');

// Вообще, я решил взять класс только потому, что мне было необходимо понимать, как он работает
class useTemp {
    temp
    socket
    target

    constructor(target, socket) {
        this.temp = low(adapter).get('temp').get(target)

        this.socket = socket
        this.target = target
    }


    /* user */

    saveUser = payload => {
        this.temp = low(adapter).get('temp').get(this.target)
        if (!payload.userLogin) return this.socket.emit('server:error', { status: 404, text: 'Логин пользователя отсутствует' })
        if (!this.temp.find(payload).value()) {
            this.temp.push(payload).write()
        }
    }

    removeUser = payload => {
        this.temp = low(adapter).get('temp').get(this.target)

        if (this.temp.find(payload).value()) {
            this.temp.remove(payload).write()
        }
    }

    getActiveUsers = () => this.temp.value()

    getUser = userLogin => {
        this.temp = low(adapter).get('temp').get(this.target)
        return this.temp.find({ userLogin }).value()
    }


    /* notice */

    saveNotice = payload => {
        this.temp = low(adapter).get('temp').get(this.target)

        if (!this.temp.find(payload).value()) this.temp.push(payload).write()
    }

    removeNotice = payload => {
        this.temp = low(adapter).get('temp').get(this.target)

        if (this.temp.find(payload).value()) {
            this.temp.remove(payload).write()
        }
    }

    checkNotice = userLogin => {
        this.temp = low(adapter).get('temp').get(this.target)

        try {
            const notice = this.temp.find({ to: userLogin }).value()
            if (notice) this.socket.emit('user:send-notice', notice)

        } catch (error) {
            this.socket.emit('server:error', { status: 500, text: `${error}` })
        }
    }

    getNotice = userLogin => {
        this.temp = low(adapter).get('temp').get(this.target)
        let allNotice = []

        try {
            this.temp.value().forEach(notice => {
                if (notice.to === userLogin) {
                    allNotice.push(notice)
                }
            })

            this.socket.emit('user:update-notice', allNotice)
        } catch (error) {
            this.socket.emit('server:error', { status: 500, text: `${error}` })
        }
    }

    replyNotice = payload => {
        this.temp = low(adapter).get('temp').get(this.target)

        try {
            if (payload.type === 'accept') {
                this.removeNotice(payload)
                this.setFriend({ userLogin: payload.from, contactLogin: payload.to })

                let notice = {
                    id: `${nanoid()}`,
                    from: payload.from,
                    to: payload.to,
                    type: 'notice',
                    code: 'accept',
                    text: `принял(-a) заявку`,
                }

                this.saveNotice(notice)

                return notice
            } else {
                this.removeNotice({
                    from: payload.to,
                    to: payload.from,
                    type: 'send-invite',
                    id: payload.id
                })

                let notice = {
                    id: `${nanoid()}`,
                    from: payload.from,
                    to: payload.to,
                    type: 'notice',
                    text: `не принял(-a) заявку`,
                }

                this.saveNotice(notice)

                return notice
            }
        } catch (error) {
            this.socket.emit('server:error', { status: 500, text: `${error}` })
        }
    }

    setFriend = ({ userLogin, contactLogin }) => {
        const db = low(adapter)
        try {
            const userData = getUserData(userLogin, 'login')
            const contactData = getUserData(contactLogin, 'login')

            if (!userData.contacts.find(contact => contact.userLogin === contactLogin)) {
                db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts').push({
                    userID: contactData.userID,
                    userLogin: contactData.userLogin,
                    userName: contactData.userName
                }).write()

            }
            if (!contactData.contacts.find(contact => contact.userLogin === userLogin)) {
                db.get('users').find({ userLogin: contactLogin }).get('userData').get('contacts').push({
                    userID: userData.userID,
                    userLogin: userData.userLogin,
                    userName: userData.userName
                }).write()
            }

            this.socket.to(this.getUser(userLogin).socketID).emit('update:data')
            this.socket.to(this.getUser(contactLogin).socketID).emit('update:data')

            this.socket.to(this.getUser(userLogin).socketID).emit('debug')
            this.socket.to(this.getUser(contactLogin).socketID).emit('debug')
        } catch (error) {
            return { status: 500, error: true, text: `${error}` }
        }
    }

    checkFriendList = payload => {
        const db = low(adapter)

        try {
            const userData = getUserData(payload.from, 'login')
            if (userData.contacts.find(contact => contact.userLogin === payload.to)) {
                this.socket.emit('debug', 'exist')
                return 'exist'
            }
        } catch (error) {
            this.socket.emit('server:error', { status: 500, error: true, text: `${error}` })
        }
    }
}

const registerUser = ({ id, userMail, userLogin, hashPassword, userName }) => {
    const db = low(adapter)

    try {
        db.get('users').push({
            ID: id,
            userMail: userMail,
            userLogin: userLogin,
            userPassword: hashPassword,
            userData: {
                userName: userName,
                status: false,
                url: `/${userLogin}`,
                notice: {
                    invites: [],
                    other: []
                },
                contacts: [],
                chats: [],
            }
        }).write()

        return { error: false, data: db.get('users').find({ userLogin: userLogin }).value() }
    } catch (error) {
        return { error: true, data: `${error}` }
    }
}

const getAllUsers = (userLogin) => {
    const db = low(adapter)

    try {
        const allUsers = []

        db.get('users').value().forEach(user => {
            if (user.userLogin !== userLogin) allUsers.push({ userLogin: user.userLogin, userName: user.userData.userName })
        });

        return { data: allUsers }
    } catch (error) {
        return { error: true, data: `${error}` }
    }
}

const authPassword = (userMail, userPassword) => {
    const db = low(adapter)

    try {
        const hashPassword = db.get('users').find({ userMail: userMail }).value().userPassword

        if (bcrypt.compareSync(userPassword, hashPassword, function (res) { return res })) {
            return { error: false, compare: true }
        } else {
            return { error: false, compare: false }
        }

    } catch (error) {
        return { text: `${error}`, error: true }
    }
}

const deleteFriend = (req) => {
    const { userLogin, contactLogin } = req.body
    const db = low(adapter)
    try {
        db.get('users')
            .find({ userLogin: contactLogin })
            .get('userData').get('contacts')
            .remove({ userLogin: userLogin })
            .write()
        db.get('users')
            .find({ userLogin: userLogin })
            .get('userData').get('contacts')
            .remove({ userLogin: contactLogin })
            .write()

        return req
    } catch (error) {
        req.error = { text: `${error}`, error }
        return req
    }
}



/**
 * Функция для доступа к данным через разные ключи
 * @param {String} target Значение поля: token, mail, login
 * @param {'mail' | 'login' | 'token'} type Тип поиска по полю: token, mail, login
 */

const getUserData = (target, type) => {
    const db = low(adapter)

    if (type === 'token') {
        const user = db.get('users').find({ refreshToken: target }).value()

        if (user) {
            return {
                userID: user.ID,
                userMail: user.userMail,
                userLogin: user.userLogin,
                userName: user.userData.userName,
                url: user.userData.url,
                contacts: user.userData.contacts,
                chats: user.userData.chats,
                notice: user.userData.notice,
            }
        }
    }
    if (type === 'mail') {
        const user = db.get('users').find({ userMail: target }).value()

        if (user) {
            return {
                userID: user.ID,
                userMail: user.userMail,
                userLogin: user.userLogin,
                userName: user.userData.userName,
                url: user.userData.url,
                contacts: user.userData.contacts,
                chats: user.userData.chats,
                notice: user.userData.notice,
            }
        }
    }
    if (type === 'login') {
        const user = db.get('users').find({ userLogin: target }).value()

        if (user) {
            return {
                userID: user.ID,
                userMail: user.userMail,
                userLogin: user.userLogin,
                userName: user.userData.userName,
                url: user.userData.url,
                contacts: user.userData.contacts,
                chats: user.userData.chats,
                notice: user.userData.notice,
            }
        }
    }
}


const setStatus = (target, online) => {
    const db = low(adapter)

    db.get('users').find({ userLogin: target }).get('userData').set('status', online).write()
}

module.exports = {
    getUserData,
    setStatus,
    registerUser,
    authPassword,
    getAllUsers,
    deleteFriend,

    useTemp
}