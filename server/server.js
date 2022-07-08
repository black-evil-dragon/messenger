console.clear();

/*   Modules    */


const { version, proxy } = require('./package.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const jwt = require('../chat/node_modules/jsonwebtoken')
const bcrypt = require('bcrypt')

const chalk = require('chalk');
const uniqid = require('uniqid')
const nanoid = require('nanoid').customAlphabet('1234567890', 10);



const express = require('express')
const socket = require('socket.io')
const http = require('http')
const port = 8000
const app = express()
const server = http.createServer(app)
const io = socket(server, {
    cors: {
        origin: '*'
    }
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



/*  DataBase    */
const db_init = low(adapter)

db_init.defaults(
    {
        users: []
    }
).write()


/*   Server     */

const accessTokenSecret = 'AccessToken';
const refreshTokenSecret = 'RefreshToken';
const saltRounds = 10;

let refreshTokens = []

console.log(chalk.green('Server started successfully!\n'));


/*  Functions   */

const getUserByLogin = (login) => {
    const db = low(adapter)
    const result = db.get('users').find({ userLogin: login }).value()
    return result
}




/*  Get */

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/server.html')
})

app.get('/users', function (req, res) {
    const db = low(adapter)
    let DB = db.get('users').value()

    res.json(DB)
})



/*  Post    */

/*      getcontact  */
app.post('/getcontact', function (req, res) {
    const db = low(adapter)

    const { contactLogin, userLogin } = req.body

    const getContactsByTarget = db.get('users').find({ userLogin: contactLogin }).get('contacts').find({ userLogin: userLogin }).value()
    const getContactsByUser = db.get('users').find({ userLogin: userLogin }).get('contacts').find({ userLogin: contactLogin }).value()

    let result = ''
    if (getUserByLogin(contactLogin)) {
        if (!getContactsByTarget) {
            db.get('users').find({ userLogin: contactLogin }).get('contacts').push({ userLogin: userLogin, friend: false }).write()
        }
        if (!getContactsByUser) {
            db.get('users').find({ userLogin: userLogin }).get('contacts').push({ userLogin: contactLogin, friend: false }).write()
        } else { result = 'Пользователь уже добавлен в контакты' }
    } else {
        result = 'NOT_FOUND'
    }
    res.send(result)
})


/*      removecontact   */

app.post('/removecontact', function (req, res) {
    const db = low(adapter)

    const { contactLogin, userLogin } = req.body
    let result = ''

    if (getUserByLogin(contactLogin)) {
        db.get('users').find({ userLogin: contactLogin }).get('contacts').remove({ userLogin: userLogin }).write()
        db.get('users').find({ userLogin: userLogin }).get('contacts').remove({ userLogin: contactLogin }).write()
    } else { result = 'Error' }
    res.send(result)
})


/*      get user data   */

app.post('/user', function (req, res) {
    const db = low(adapter)

    const { userLogin } = req.body
    const getUserByLogin = db.get('users').find({ userLogin: userLogin }).value()
    const contacts = db.get('users').find({ userLogin: userLogin }).get('contacts').value()

    const user_data = {
        userLogin: getUserByLogin.userLogin,
        userName: getUserByLogin.userName,
        url: getUserByLogin.url,
        contacts: contacts
    }

    res.send(user_data)
})


/*      signup  */

app.post('/signup', function (req, res) {
    const db = low(adapter)
    const id = nanoid()

    const { userLogin, userName, userPassword } = req.body

    if (getUserByLogin(userLogin)) {
        const result = 'USER_ALREADY_CREATED'
        res.send(result)
    } else {
        bcrypt.hash(userPassword, saltRounds, function(err, hash) {
            db.get('users').push({
                ID: id,
                userLogin: userLogin,
                userName: userName,
                userPassword: hash,
                status: false,
                url: `/${userLogin}`,
                contacts: [],
                chats: []
            }).write()
        });
        res.send()
    }
})


/*      signin  */

app.post('/signin', function (req, res) { // Думаю надо переименовать в /login
    const db = low(adapter)

    const { userLogin, userPassword } = req.body
    const getUserByLogin = db.get('users').find({ userLogin: userLogin }).value() // const values = getUserByLogin(userLogin) надо посмотреть, почему не работает
    let result = ''

    if (getUserByLogin) {
        const checkPassword = bcrypt.compare(userPassword, getUserByLogin.userPassword)
        if(checkPassword) {
            result = ''
        }

    } else {
        result = 'ERROR'
    }

    res.send(result)

})

/* --------------------Test code-------------------- */

/* token */




io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
});



/* ------------Init server------------*/

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\nVersion: ${version}\n\n${chalk.bold('  URL:    ')}${proxy}\n`);
    console.log('Users socket ID:');
})