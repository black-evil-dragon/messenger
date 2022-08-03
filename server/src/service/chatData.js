const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const checkID = (id1, id2) => {
    const db = low(adapter)

    if(db.get('chats').find({ ChatID: `${id1}_${id2}`}).value()) {return `${id1}_${id2}`}
    if(db.get('chats').find({ ChatID: `${id2}_${id1}`}).value()) {return `${id2}_${id1}`}
}

const setChats = (payload) => {
    const db = low(adapter)
    if (!db.get('users').find({ userLogin: payload.userLogin }).get('userData').get('chats').find({ chatName: payload.contactData.userName }).value()) {
        db.get('users').find({ userLogin: payload.userLogin }).get('userData').get('chats').push({
            chatID: payload.id,
            chatName: `${payload.contactData.userName}`,
            members: payload.members
        }).write()
    } else {
        return 'e_chat/exist'
    }
    if (!db.get('users').find({ userLogin: payload.contactLogin }).get('userData').get('chats').find({ chatName: payload.userData.userName }).value()) {
        db.get('users').find({ userLogin: payload.contactLogin }).get('userData').get('chats').push({
            chatID: payload.id,
            chatName: `${payload.contactData.userName}`,
            members: payload.members
        }).write()
    }
}

module.exports = {
    checkID,
    setChats
}