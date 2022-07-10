console.clear();

/*   Modules    */

const router = require('./src/router');
const { version, proxy } = require('../chat/package.json');
const { authMiddleware } = require('./src/middleware/auth')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')
const chalk = require('chalk');

const cors = require('cors');
const cookieParser = require('cookie-parser')
const express = require('express')
const socket = require('socket.io')
const http = require('http')
const port = 8000
const app = express()
const server = http.createServer(app)
const io = socket(server)

/*
, {
    cors: {
        origin: '*',
        Credential: true
    }
}
*/

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    credential: true,
    origin: proxy
}))



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