console.clear();

/*   Modules    */

const Routes = require('./src/server');
const { version, proxy } = require('../chat/package.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')
const chalk = require('chalk');

const cookieParser = require('cookie-parser')
const express = require('express')
const socket = require('socket.io')
const http = require('http');
const { getUserData, setStatus } = require('./src/service/userData');
const { checkID, getChatData } = require('./src/service/chatData');
const { validateAccessToken } = require('./src/service/token');
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



app.get('/', Routes.homePage)
    .get('/users', Routes.getUsers)
    .get('/api/invite', Routes.inviteUser)

    .post('/api/signup', Routes.SignUp)
    .post('/api/signin', Routes.SignIn)
    .post('/api/logout', Routes.logout)

    .post('/api/refresh', Routes.refresh)
    .post('/api/auth', Routes.authUser)
    .post('/api/update/data', Routes.updateData)

    .post('/api/acceptInvite', Routes.acceptInvite)
    .post('/api/delete/notice', Routes.deleteNotice)

    .post('/api/delete/contact', Routes.deleteContact)

    .post('/api/chat/create', Routes.createChat)
    .post('/api/chat/delete', Routes.createChat)


const usersOnline = []

io.on('connection', (socket) => {
    console.log(`${chalk.bold(socket.id)} ${chalk.green('connected')}`)

    socket.on('chat:create', response => {
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

    socket.on('chat:enter', response => {
        if (validateAccessToken(response.token)) {
            const chatData = getChatData(response.chat.chatID, 'ID')
            chatData.chatName = response.chat.chatName

            socket.emit('chat:sendData', chatData)
        } else {
            socket.emit('chat:sendData', 401)
        }
    })

    socket.on('user:online', response => {
        setStatus(response.userInfo, true)
        usersOnline.push(response)
    })

    socket.on('get:users:online', () => socket.emit('users:online', usersOnline))

    socket.on('debug', response => console.log(response))

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