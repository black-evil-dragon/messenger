console.clear();

const chalk = require('chalk');
const express = require('express')
const socket = require('socket.io')
const http = require('http')
const port = 8000
const app = express()
const server = http.createServer(app)
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

console.log(chalk.green('Server started successfully!\n'));

const chat = new Map()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})


app.get('/chat/:id', function (req, res) {
    const { id: ID } = req.params

    if (chat.has(ID)) {
        var userData = {
            users: [...chat.get(ID).get('users').values()],
            messages: [...chat.get(ID).get('messages').values()],
        }
    }
    else {
        userData = `Чат с id${ID} ещё не создан`
    }
    res.send(userData)
})

app.post('/', function (req, res) {
    const { ID } = req.body
    if (!chat.has(ID)) {
        chat.set(
            ID,
            new Map([
                ['users', new Map()],
                ['messages', []]
            ]))
    }
    res.send()
})

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('CHAT:JOIN', ({ ID, userName }) => {
        socket.join(ID)
        chat.get(ID).get('users').set(socket.id, userName)

        const users = [...chat.get(ID).get('users').values()]
        socket.broadcast.to(ID).emit('CHAT:SET_USERS', users)

    })

    socket.on('CHAT:NEW_MESSAGE', ({ ID, userName, text }) => {
        const object = {
            userName,
            text
        }
        chat.get(ID).get('messages').push(object)
        socket.broadcast.to(ID).emit('CHAT:ADD_MESSAGES', object)

    })

    socket.on('disconnect', () => {
        chat.forEach((value, ID) => {
            if (value.get('users').delete(socket.id)) {
                console.log(`${socket.id} disconnected`)

                const users = [...value.get('users').values()]
                socket.to(ID).emit('CHAT:SET_USERS', users)
            }
        })
    })
});

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\n\n${chalk.bold('  URL:    ')}http://localhost:${port}\n`);
    console.log('Users socket ID:');
})

