console.clear();

/*   Modules    */


const { version, proxy } = require('../chat/package.json');
const router = require('./src/router');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const chalk = require('chalk');
const uniqid = require('uniqid')
const nanoid = require('nanoid').customAlphabet('1234567890', 10);


const cookieParser = require('cookie-parser')
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
app.use(cookieParser())



/*  DataBase    */
const db_init = low(adapter)

db_init.defaults(
    {
        users: []
    }
).write()


/*   Server     */


console.log(chalk.green('Server started successfully!\n'));


/*  Get */

app.get('/', router.homePage)
    .get('/users', router.getUsers)

/*  Post    */
app.post('/getcontact', router.getContacts)
    .post('/removecontact', router.removeContacts)
    .post('/user', router.postUserData)
    .post('/signup', router.SignUp)
    .post('/signin', router.SignIn)
    .post('/logout', router.logout)
    .post('/refresh', router.refresh)


io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
});

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\nVersion: ${version}\n\n${chalk.bold('  URL:    ')}${proxy}\n`);
    console.log('Users socket ID:');
})