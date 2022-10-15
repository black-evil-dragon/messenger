const chalk = require('chalk');
const { getUserData, setStatus, getAllUsers, useTemp } = require('../service/userData');
const { checkID, getChatData, addSocket, removeSocket, setMessages } = require('../service/chatData');
const { validateAccessToken } = require('../service/token');

module.exports = function (io) {
    io.on('connection', socket => {
        const tempUser = new useTemp('userOnline', socket)
        const tempNotice = new useTemp('noticeTemp', socket)

        const socketUser = socket.handshake.query

        if (!tempUser.getUser(socketUser.userLogin)) {
            tempNotice.getNotice(socketUser.userLogin)

            io.emit('users:online', tempUser.getActiveUsers())
            tempUser.saveUser({ userLogin: socketUser.userLogin, socketID: socket.id })

            console.log(`${socket.id} ${chalk.bold(socketUser.userLogin)} ${chalk.green('connected')}`)
        } else {
            socket.disconnect(true)
        }


        /*  Chat  */

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


        /*  User    */

        socket.on('user:send-invite', response => {
            const receiver = tempUser.getUser(response.to)

            if (receiver) {
                if (!tempNotice.checkFriendList(response)) {
                    tempNotice.saveNotice(response)
                    socket.to(receiver.socketID).emit('user:send-notice', response)
                } else {
                    socket.emit('user:error', { status: 200, text: 'Упс, этот пользователь ваш друг' })
                }
            } else {
                if (getUserData(response.to, 'login')) {
                    tempNotice.saveNotice(response)
                } else {
                    socket.emit('user:error', { status: 200, text: 'Упс, мы не смогли найти этого пользователя' })
                }
            }
        })

        socket.on('user:invite-response', response => {
            const receiver = tempUser.getUser(response.to)
            if (receiver) {
                let notice = tempNotice.replyNotice(response)
                socket.to(receiver.socketID).emit('user:send-notice', notice)

                if (notice.code === 'accept') {
                    socket.to(receiver.socketID).emit('update:data')
                    socket.emit('update:data')
                }
            }
        })

        socket.on('user:update-notice', () => {
            tempNotice.getNotice(socket.handshake.query.userLogin)
        })

        socket.on('user:delete-notice', response => tempNotice.removeNotice(response))


        /*  Users   */

        socket.on('users:get-users', response => {
            socket.emit('users:get-users', getAllUsers(response))
        })

        /*  Other   */

        socket.on('debug', response => console.log(response))

        socket.on("disconnect", () => {
            tempUser.removeUser({ userLogin: socket.handshake.query.userLogin, socketID: socket.id })
            io.emit('users:online', tempUser.getActiveUsers())
            console.log(`${socket.id} ${chalk.bold(socket.handshake.query.userLogin)} ${chalk.red('disconnected')}`);
        });
    })
}