const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')


/**
 * Функция для доступа к данным через разные ключи
 * @param {String} target Значение поля: token, mail, login
 * @param {String} type Тип поиска по полю: token, mail, login
 * @returns {String} Все данные необходимые в работе
 */
const getUserData = (target, type) => {
    const db = low(adapter)

    if (type === 'token') {
        const user = db.get('users').find({ refreshToken: target }).value()
        const users = db.get('users').value()

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
    if (type === 'mail'){
        const user = db.get('users').find({ userMail: target }).value()
        const users = db.get('users').value()

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
    if (type === 'login'){
        const user = db.get('users').find({ userLogin: target }).value()
        const users = db.get('users').value()

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

module.exports = { getUserData }