console.clear();

/*   Modules    */


const { version, proxy } = require('./package.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db/db.json')
const db = low(adapter)


const chalk = require('chalk');
const uniqid = require('uniqid')

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

db.defaults(
    {
        users: []
    }
).write()

const DB = require('./db/db.json')


/*   Server     */

console.log(chalk.green('Server started successfully!\n'));

const getUserByLogin = (login) => {
    const result = db.get('users').find({userLogin: login}).value()
    return result
}


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/server.html')
})

app.get('/users', function (req, res) {
    res.json(DB)
})


app.post('/getcontact', function (req, res) {
    const { contactLogin, userLogin } = req.body
    let result = ''
    if(getUserByLogin(contactLogin)){
        if(!db.get('users').find({userLogin: contactLogin}).get('contacts').find({userLogin: userLogin}).value()){
            db.get('users').find({userLogin: contactLogin}).get('contacts').push({userLogin: userLogin, friend:false}).write()
        }
        if(!db.get('users').find({userLogin: userLogin}).get('contacts').find({userLogin: contactLogin}).value()){
            db.get('users').find({userLogin: userLogin}).get('contacts').push({userLogin: contactLogin, friend:false}).write()
        } else { result='Пользователь уже добавлен в контакты' }
    } else {
        result = 'NOT_FOUND'
    }
    res.send(result)
})

app.post('/user', function (req, res) {
    const { userLogin } = req.body
    const getUserByLogin = db.get('users').find({userLogin: userLogin}).value()
    const contacts = db.get('users').find({userLogin: userLogin}).get('contacts').value()

    const user_data = {
        userLogin: getUserByLogin.userLogin,
        userName: getUserByLogin.userName,
        url: getUserByLogin.url,
        contacts: contacts
    }

    res.send(user_data)
})

app.post('/signup', function (req, res) {
    const { userLogin, userName, userPassword } = req.body

    if(getUserByLogin(userLogin)) {
        const result = 'USER_ALREADY_CREATED'
        res.send(result)
    } else {
        db.get('users').push({
            ID: uniqid(),
            userLogin: userLogin,
            userName: userName,
            userPassword: userPassword,
            status: true,
            url: `profile/${userLogin}`,
            contacts: [],
            chats: []
        }).write()
        res.send()
    }
})
app.post('/signin', function (req, res) {
    const { userLogin, userPassword } = req.body
    const getUserByLogin = db.get('users').find({userLogin: userLogin}).value() // const values = getUserByLogin(userLogin) надо посмотреть, почему не работает
    let result = ''

    if(getUserByLogin && (getUserByLogin.userPassword === userPassword)){
        result = ''
    } else {
        result = 'ERROR'
    }

    res.send(result)

})

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
});

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}, version: ${version}\n\n${chalk.bold('  URL:    ')}${proxy}\n`);
    console.log('Users socket ID:');
})