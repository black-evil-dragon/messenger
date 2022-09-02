const chalk = require('chalk');
const { getUserData, setStatus, getAllUsers } = require('../service/userData');
const { checkID, getChatData, addSocket, removeSocket, setMessages } = require('../service/chatData');
const { validateAccessToken } = require('../service/token');

module.exports = function (io) {
    const usersTemp = {}

    io.on('connection', socket => {
        console.log(`${chalk.bold(socket.id)} ${chalk.green('connected')}`)
        console.log(socket.handshake.query.userLogin);

        socket.on('chat:create', response => {//не думаю, что этот код нужен
            const { userLogin, contactLogin, private } = response

            const userData = getUserData(userLogin, 'login')
            const contactData = getUserData(contactLogin, 'login')

            if (!contactData || !userData) return

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

                //addSocket(response.chat.chatID, socket.id)

                socket.join(response.chat.chatID)
            } else {
                socket.emit('chat:sendData', 401)
            }
        })

        socket.on('chat:send-message', response => {
            setMessages(response.chatID, response.messageData)
            socket.broadcast.to(response.chatID).emit('chat:add-message', response)
        })

        socket.on('chat:user-typing', response => socket.broadcast.emit('chat:user-typing/res', response))

        socket.on('user:login', response => {
            usersTemp[socket.id] = response
            for (const [key, value] of Object.entries(usersTemp)) {
                //console.log(key, value)
            }
        })

        socket.on('users:get-users', response => {
            const allUsers = getAllUsers(response)
            socket.emit('users:get-users', allUsers)
        })
        socket.on('debug', response => console.log(response))

        socket.on("disconnect", () => {
            console.log(`${chalk.bold(socket.id)} ${chalk.red('disconnected')}`);
            delete usersTemp[socket.id]
        });
    })
}