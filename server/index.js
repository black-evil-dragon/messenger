console.clear();

/*   Modules    */

const { version, proxy } = require('../chat/package.json');


const chalk = require('chalk');

const cookieParser = require('cookie-parser')


/*  Express */

const port = 8000
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/*  Express — Routes  */
require('./src/routes/routes')(app);



/*  Server  */

const http = require('http');
const server = http.createServer(app)


/*  Socket  */

const socket = require('socket.io')
const io = socket(server, {
    cors: {
        origin: '*',
        credential: true
    }
})

require('./src/socket/socket')(io);


/*  DataBase  */

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')

const db_init = low(adapter)
const db_package = low(new FileSync('./package.json'))


db_init.defaults(
    {
        users: [],
        chats: [],
        temp: {
            userOnline: [],
            noticeTemp: []
        }
    }
).write()
db_init.get('temp').set('userOnline', []).write()


db_package.set('version', version).write()


/*   Server     */

console.log(chalk.green('Server started successfully!\n'));

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\nVersion: ${version}\n\n${chalk.bold('  URL:    ')}${proxy}\n`);
    console.log('Users socket ID:');
})