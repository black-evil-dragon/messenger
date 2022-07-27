console.clear();

/*   Modules    */

const router = require('./src/router');
const { version, proxy } = require('../chat/package.json');
const { newNotice } = require('./src/socket/socket');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')
const chalk = require('chalk');

const cookieParser = require('cookie-parser')
const express = require('express')
const socket = require('socket.io')
const http = require('http')
const port = 8000
const app = express()
const server = http.createServer(app)
const io = socket(server, {
    cors: {
        origin: '*',
        credential: true
    }
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



/*  DataBase    */
const db_init = low(adapter)
const db_package = low(new FileSync('./package.json'))

db_init.defaults(
    {
        users: [],
        chats: []
    }
).write()

db_package.set('version', version).write()



/*   Server     */


console.log(chalk.green('Server started successfully!\n'));


/*  Get */

app.get('/', router.homePage)
    .get('/users', router.getUsers)
    .get('/api/invite', router.inviteUser)

/*  Post    */
app.post('/api/signup', router.SignUp)
    .post('/api/signin', router.SignIn)
    .post('/api/logout', router.logout)
    .post('/api/refresh', router.refresh)
    .post('/api/auth', router.authUser)
    .post('/api/update/data', router.updateData)
    .post('/api/acceptInvite', router.acceptInvite)
    .post('/api/delete/notice', router.deleteNotice)
    .post('/api/delete/contact', router.deleteContact)
    .post('/api/chat/create', router.createChat)


io.on('connection', (socket) => {
    console.log(`${socket.id} connected`)

    socket.on('user:login', () => {
        socket.emit('user:set:notice', 'hello')
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\nVersion: ${version}\n\n${chalk.bold('  URL:    ')}${proxy}\n`);
    console.log('Users socket ID:');
})