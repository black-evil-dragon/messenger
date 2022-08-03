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
const http = require('http');
const { getUserData } = require('./src/service/userData');
const { checkID } = require('./src/service/chatData');
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
        chats: [],
        socket: []
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
    console.log(`${chalk.bold(socket.id)} ${chalk.green('connected')}`)


    socket.on('chat:create', (response) => {
        const { userLogin, contactLogin, private } = response

        const userData = getUserData(userLogin, 'login')
        const contactData = getUserData(contactLogin, 'login')

        const ChatID = checkID(userData.userID, contactData.userID)

        if (ChatID) {
            socket.join(ChatID)

            const members = db_init.get('chats').find({ ChatID: ChatID }).get('members').value()

            socket.broadcast.to(ChatID).emit('chat:created', {
                members,
                socketID: socket.id
            })

        } else {
            socket.emit('response:error', 'e_chat/not-exist')
        }

    });

    socket.on("disconnect", () => {
        console.log(`${chalk.bold(socket.id)} ${chalk.red('disconnected')}`);
    });
})


server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\nVersion: ${version}\n\n${chalk.bold('  URL:    ')}${proxy}\n`);
    console.log('Users socket ID:');
})

/*
const chats = db_init.get('chats').value()
        chats.forEach((value, ID) => {
            if(value.get)
        });

*/