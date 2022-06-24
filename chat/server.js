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

console.log(chalk.green('Server started successfully\n'));

app.get('/', function (req, res) {
    res.send('Hello world')
})

io.on('connection', (socket) => {
    console.log(`${socket.id}`);
});

server.listen(port, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`App listening on port: ${chalk.underline(port)}\n\n${chalk.bold('  URL:    ')}http://localhost:${port}\n`);
    console.log('Users socket ID:');
})

