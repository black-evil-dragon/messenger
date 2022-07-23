const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const getUserData = (target, type) => {
    const db = low(adapter)

    if (type === 'token') {
        const user = db.get('users').find({ refreshToken: target }).value()
        const users = db.get('users').value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts,
            notice: user.userData.notice,
            users
        }
    }
    if (type === 'mail'){
        const user = db.get('users').find({ userMail: target }).value()
        const users = db.get('users').value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts,
            notice: user.userData.notice,
            users
        }
    }
    if (type === 'login'){
        const user = db.get('users').find({ userLogin: target }).value()
        const users = db.get('users').value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts,
            notice: user.userData.notice,
            users
        }
    }
}

module.exports = { getUserData }