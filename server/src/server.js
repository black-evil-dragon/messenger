const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db_test.json')
const nanoid = require('nanoid').customAlphabet('1234567890', 10);

const bcrypt = require('bcrypt');
const { slt } = require('./config/config').config;

const { generateTokens, saveToken, removeToken, refreshThisToken, validateRefreshToken } = require('./service/token');
const { authMiddleware } = require('./middleware/auth');
const { getUserData, registerUser, authPassword, deleteFriend } = require('./service/userData');
const { checkID, setChats, createChatData } = require('./service/chatData');


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

const deleteContact = (req, res) => {
    if (authMiddleware(req, res) !== 401) {
        if (deleteFriend(req).error) {
            res.json({ status: 500, error: req.error })
            return
        }

        res.json({ status: 200 })
        return
    } else {
        return res.send('401C')
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

        if (!checkPassword.error) {
            if (!checkPassword.compare) {
                res.json({ status: 200, textError: 'Упс, Вы похоже неправильно ввели свою почту!' })
                return
            }
        } else {
            res.json({ status: 500, textError: checkPassword.text })
            return
        }
        const tokens = generateTokens({ userMail: userData.userMail, userLogin: userData.userLogin })
        saveToken(userData.userLogin, tokens.refreshToken)


        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ status: 200, token: tokens.accessToken, userData })
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

    const chat = createChatData(req.body)

    if (chat.text) return res.json({ status: 200, text: chat.text })
    if (chat.remark) return res.json({ status: 200, remark: chat.remark })
    if (chat.error) return res.json({ status: 500, error: chat.error })

    return res.json({ status: 200 })
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

    deleteContact,

    createChat,
    deleteChat
}

