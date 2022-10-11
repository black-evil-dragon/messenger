const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db_test.json')
const nanoid = require('nanoid').customAlphabet('1234567890', 10);

const bcrypt = require('bcrypt');
const { slt } = require('./config/config').config;

const { generateTokens, saveToken, removeToken, refreshThisToken, validateRefreshToken } = require('./service/token');
const { authMiddleware } = require('./middleware/auth');
const { getUserData, registerUser, authPassword } = require('./service/userData');
const { checkID, setChats } = require('./service/chatData');


/* Routes func-s */

const homePage = (req, res) => {
    res.sendFile(__dirname + '/server.html')
}

const getUsers = (req, res) => {
    const db = low(adapter)
    if (authMiddleware(req, res) === 401) { return res.sendStatus(401) }

    let DB = db.get('users').value()
    res.json(DB)

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
            //contactNotice.get('other').push({ userLogin: userLogin, type: 'acceptInvite' }).write()

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

    if (authMiddleware(req, res) !== 401) {
        if (userContact.find({ userLogin: contactLogin }).value()) {
            userContact.remove({ userLogin: contactLogin }).write()
            if (friendContact.find({ userLogin: userLogin }).value()) {
                friendContact.remove({ userLogin: userLogin }).write()
            }
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
    const { userMail, userLogin, userName, userPassword } = req.body

    if (getUserData(userMail, 'mail')) {
        res.json({ status: 200, error: 'Упс, такая почта зарегестрирована' })
        return
    }
    if (getUserData(userLogin, 'login')) {
        res.json({ status: 200, error: 'Упс, такой логин зарегестрирован' })
        return
    }

    const id = nanoid()
    const hashPassword = bcrypt.hashSync(userPassword, slt)

    const userInfo = {
        id,
        userMail,
        userLogin,
        userName,
        hashPassword
    }

    const userData = registerUser(userInfo)

    if (userData.error) {
        res.json({ status: 500, text: 'Ошибка с регистрацией пользователя на сервере', error: userData.data })
        return
    } else {
        const tokens = generateTokens({ userMail: userData.userMail, userLogin: userData.userLogin })
        saveToken(userLogin, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ status: 200 })
        return
    }
}

const SignIn = (req, res) => {
    const { userMail, userPassword } = req.body

    const userData = getUserData(userMail, 'mail')

    if (userData) {

        const checkPassword = authPassword(userMail, userPassword)

        if(!checkPassword.error) {
            if (!checkPassword.compare) {
                res.json({ status: 200, textError: 'Упс, Вы похоже неправильно ввели свою почту!'})
                return
            }
        } else {
            res.json({ status: 500, textError: checkPassword.text})
            return
        }
        const tokens = generateTokens({ userMail: userData.userMail, userLogin: userData.userLogin })
        saveToken(userData.userLogin, tokens.refreshToken)


        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ status: 200, token: tokens.accessToken, userData})
        return

    } else {
        res.json({ status: 200, text: 'Упс, такого пользователь не существует', error: 'user-no-exist' })
        return
    }

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
    const { userLogin } = req.body
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

    if (!contactData) {
        res.send('404C/user')
        return
    }

    if (authMiddleware(req, res) !== 401 && userData && contactData) {
        const id = `${userData.userID}_${contactData.userID}`
        if (db.get('chats').find({ ChatID: id }).value()) {
            const data = {
                id,
                userLogin,
                contactLogin,
                userData,
                contactData,
            }
            const result = setChats(data)
            result ? res.send(result) : res.send()
        } else {
            db.get('chats').push({
                ChatID: id,
                settings: {
                    private: private,
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
                connections: [],
                messages: []
            }).write()

            const data = { // Ладно
                id,
                userLogin,
                contactLogin,
                userData,
                contactData,
            }

            setChats(data)

            res.send()
        }
    } else {
        res.send('401C')
    }

}

const deleteChat = (req, res) => {

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

    createChat,
    deleteChat
}

