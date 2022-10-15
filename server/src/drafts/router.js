const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')
const nanoid = require('nanoid').customAlphabet('1234567890', 10);

const bcrypt = require('bcrypt');

const { generateTokens, saveToken, removeToken, refreshThisToken, validateRefreshToken } = require('../service/token');
const { authMiddleware } = require('../middleware/auth');
const { slt } = require('../config/config').config
const { getUserData } = require('../service/userData');
const { checkID, setChats } = require('../service/chatData');


// Старые участки кода, хочу позже поменять на универсальную функ getUserData --
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
// --




/* Router */

const homePage = (req, res) => {
    res.sendFile(__dirname + '/server.html')
}

const getUsers = (req, res) => {
    const db = low(adapter)

    if (authMiddleware(req, res) === 401) return res.sendStatus(401)

    res.json(db.get('users').value())
    return
}

const inviteUser = (req, res) => {
    const db = low(adapter)
    const { contactLogin, userLogin } = req.query

    if (authMiddleware(req, res) === 401) { return res.sendStatus(401) }

    const user = db.get('users').find({ userLogin: contactLogin }).value()
    const contacts = db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts')
    const contactNotice = db.get('users').find({ userLogin: contactLogin }).get('userData').get('notice').get('invites')

    if (!contactNotice.find({ userLogin: userLogin }).value()) {
        if (!contacts.find({ userLogin: contactLogin }).value()) {
            if (user) {
                contactNotice.push({ userLogin: userLogin }).write()
                res.send('Ok')
            } else {
                res.send('404C')
            }
        } else {
            res.send('200C')
        }

    } else {
        res.send('200C')
    }
}

const acceptInvite = (req, res) => {
    const db = low(adapter)
    const { contactLogin, userLogin, type } = req.body

    if (authMiddleware(req, res) === 401) { return res.sendStatus(401) }

    const userContacts = db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts')
    const contactContacts = db.get('users').find({ userLogin: contactLogin }).get('userData').get('contacts') // contactContacts lol
    const userNotice = db.get('users').find({ userLogin: userLogin }).get('userData').get('notice').get('invites')
    const contactNotice = db.get('users').find({ userLogin: contactLogin }).get('userData').get('notice')


    if (type === 'accept') {
        if (userNotice.find({ userLogin: contactLogin }).value()) {
            userNotice.remove({ userLogin: contactLogin }).write()
            contactNotice.get('other').push({ userLogin: userLogin, type: 'acceptInvite' }).write()

            const contact_data = getUserData(contactLogin, 'login')
            const user_data = getUserData(userLogin, 'login')

            const contactData = {
                userLogin: contact_data.userLogin,
                userName: contact_data.userName
            }
            const userData = {
                userLogin: user_data.userLogin,
                userName: user_data.userName
            }
            contactContacts.push(userData).write()
            userContacts.push(contactData).write()

            res.send(contactData)
        } else {
            res.send('200C')
        }
    }
    if (type === 'decline') {
        if (userNotice.find({ userLogin: contactLogin }).value()) {
            userNotice.remove({ userLogin: contactLogin }).write()
            contactNotice.get('other').push({ userLogin: userLogin, type: 'declineInvite' }).write()
            res.send()
        } else {
            res.send('200C')
        }
    }
}

const deleteNotice = (req, res) => {
    const db = low(adapter)
    const { userLogin, contactLogin } = req.body

    if (authMiddleware(req, res) === 401) {
        return res.sendStatus(401)
    } else {
        const userNotice = db.get('users').find({ userLogin: userLogin }).get('userData').get('notice').get('other')
        if (userNotice.find({ userLogin: contactLogin }).value()) {
            userNotice.remove({ userLogin: contactLogin }).write()
            res.send()
        } else {
            res.send('200C')
        }
    }
}

const deleteContact = (req, res) => {
    const db = low(adapter)
    const { userLogin, contactLogin } = req.body

    const userContact = db.get('users').find({ userLogin: userLogin }).get('userData').get('contacts')
    const friendContact = db.get('users').find({ userLogin: contactLogin }).get('userData').get('contacts')
    const contactNotice = db.get('users').find({ userLogin: contactLogin }).get('userData').get('notice')

    if (authMiddleware(req, res) !== 401) {
        if (userContact.find({ userLogin: contactLogin }).value()) {
            userContact.remove({ userLogin: contactLogin }).write()
            if (friendContact.find({ userLogin: userLogin }).value()) {
                friendContact.remove({ userLogin: userLogin }).write()
            }
            contactNotice.get('other').push({ userLogin: userLogin, type: 'deleteContact' }).write()
            res.send()
        } else {
            console.log(contactLogin);
            res.send('404C')
        }
    } else {
        res.send('200C')
    }
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
                notice: {
                    invites: [],
                    other: []
                },
                contacts: [],
                chats: [],
            }
        }).write()

        const user_data = getUserData(userMail, 'mail')

        const tokens = generateTokens(user_data)
        saveToken(userLogin, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 5 }).sendStatus(200)
        return
    }
}

const SignIn = (req, res) => {
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

    const tokens = generateTokens({
        userMail: user_data.userMail,
        userLogin: user_data.userLogin,
    })
    saveToken(user_data.userLogin, tokens.refreshToken)

    response = true
    const result = {
        response: response,
        userData: user_data,
        token: tokens.accessToken
    }

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).send(result)
    return

}

const authUser = (req, res) => {
    if (authMiddleware(req) === 401) {
        return res.sendStatus(401)
    } else {
        const { refreshToken } = req.cookies
        const validateData = validateRefreshToken(refreshToken)

        if (validateData) {
            const userData = getUserData(refreshToken, 'token')
            res.send(userData)
        } else {
            res.send('401C')
        }
    }
}

const updateData = (req, res) => {
    if (authMiddleware(req) === 401) {
        return res.send('401C')
    } else {
        const { refreshToken } = req.cookies
        const validateData = validateRefreshToken(refreshToken)

        if (validateData) {
            const userData = getUserData(refreshToken, 'token')
            res.send(userData)
        } else {
            res.send('401C')
        }
    }
}

const logout = (req, res) => {
    const userLogin = req.body
    const { refreshToken } = req.cookies

    removeToken(userLogin, refreshToken)
    res.clearCookie('refreshToken')
    res.send()
    return
}

const refresh = (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        res.send('401C')
        return
    } else {
        const result = refreshThisToken(refreshToken)

        if (result === 401) {
            res.send('401C') // custom error
            return
        } else {
            res.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).send(result.accessToken) //1000 * 60 * 60 * 24 * 7
        }
    }
}

const createChat = (req, res) => {
    const db = low(adapter)
    const { userLogin, contactLogin, private } = req.body

    const userData = getUserData(userLogin, 'login')
    const contactData = getUserData(contactLogin, 'login')

    const id = `${userData.userID}_${contactData.userID}`
    const chatExist = db.get('chats').find({ ChatID: id }).value()


    if (authMiddleware(req, res) !== 401 && userData && contactLogin) {
        if (chatExist) {
            const data = {
                id,
                userLogin,
                contactLogin,
                userData,
                contactData,
                members: chatExist.members
            }
            const result = setChats(data)
            result ? res.send(result) : res.send()
        } else {
            db.get('chats').push({
                ChatID: id,
                settings: {
                    private: private,
                    chatName: contactData.userName
                },

                members: [
                    {
                        userLogin: userLogin,
                        userName: userData.userName
                    },
                    {
                        userLogin: contactLogin,
                        userName: contactData.userName
                    }
                ],
                messages: []
            }).write()
            const chat = db.get('chats').find({ ChatID: id }).value()
            const data = {
                id,
                userLogin,
                contactLogin,
                userData,
                contactData,
                members: chat.members
            }

            //setChats(data)

            res.send()
        }
    } else {
        res.send('401C')
    }

}


module.exports = {
    homePage,
    getUsers,

    SignUp,
    SignIn,
    logout,

    refresh,
    authUser,
    updateData,

    inviteUser,
    acceptInvite,
    deleteNotice,
    deleteContact,

    createChat
}

