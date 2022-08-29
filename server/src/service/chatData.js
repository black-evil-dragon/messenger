const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const checkID = (id1, id2) => {
    const db = low(adapter)

    if (db.get('chats').find({ ChatID: `${id1}_${id2}` }).value()) { return `${id1}_${id2}` }
    if (db.get('chats').find({ ChatID: `${id2}_${id1}` }).value()) { return `${id2}_${id1}` }
}

const setChats = (payload) => {
    const db = low(adapter)

    if (!db.get('users').find({ userLogin: payload.userLogin }).get('userData').get('chats').find({ chatName: payload.contactData.userName }).value()) {
        db.get('users').find({ userLogin: payload.userLogin }).get('userData').get('chats').push({
            chatID: payload.id,
            chatName: `${payload.contactData.userName}`
        }).write()
    } else {
        return 'e_chat/exist'
    }
    if (!db.get('users').find({ userLogin: payload.contactLogin }).get('userData').get('chats').find({ chatName: payload.userData.userName }).value()) {
        db.get('users').find({ userLogin: payload.contactLogin }).get('userData').get('chats').push({
            chatID: payload.id,
            chatName: `${payload.userData.userName}`
        }).write()
    }
}
/**
 * Поиск информации о чате
 * @param {String} target Цель поиска
 * @param {'ID'} type Тип поиска
 * @return {{}} Object of chat data
 */
const getChatData = (target, type) => {
    const db = low(adapter)

    if (type === 'ID') return db.get('chats').find({ ChatID: target }).value()
}

const addSocket = (chatID, socketID) => {
    const db = low(adapter)
    if (!db.get('chats').find({ ChatID: chatID }).get('connections').find({ socketID: socketID }).value()) {
        db.get('chats').find({ ChatID: chatID }).get('connections').push({ socketID: socketID}).write()
    }

}

const removeSocket = (socketID) => {
    const db = low(adapter)

    db.get('chats').value().forEach((chat) => {
        if(chat.connections.find(connection => connection.socketID === socketID)) {
            db.get('chats').find({ ChatID: chat.ChatID }).get('connections').remove({ socketID: socketID}).write()
        }
    })
}

const setMessages = (chatID, message) => {
    const db = low(adapter)
    db.get('chats').find({ ChatID: chatID }).get('messages').push(message).write()
}

module.exports = {
    checkID,
    setChats,
    getChatData,

    addSocket,
    removeSocket,

    setMessages
}