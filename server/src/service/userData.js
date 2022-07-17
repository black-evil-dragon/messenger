const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const getUserData = (target, type) => {
    const db = low(adapter)

    if (type === 'token') {
        const user = db.get('users').find({ refreshToken: target }).value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts,
            notice: user.userData.notice
        }
    }
    if (type === 'mail'){
        const user = db.get('users').find({ userMail: target }).value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts,
            notice: user.userData.notice
        }
    }
    if (type === 'login'){
        const user = db.get('users').find({ userLogin: target }).value()

        return {
            userMail: user.userMail,
            userLogin: user.userLogin,
            userName: user.userData.userName,
            url: user.userData.url,
            contacts: user.userData.contacts,
            notice: user.userData.notice
        }
    }
}

module.exports = { getUserData }