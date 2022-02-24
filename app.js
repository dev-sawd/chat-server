// path : chat/server/index.js

const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

const userNameToSocketId = {}
const socketIdToUserName = {}


io.on('connection', (socket) => {
    socket.on('login', ({userName}) => {
        userNameToSocketId[userName] = socket.id
        socketIdToUserName[socket.id] = userName
        console.log(userNameToSocketId)
        console.log(socketIdToUserName)
        socket.broadcast.emit('loginUser', userName)
        socket.emit('returnLoginResponse', Object.keys(userNameToSocketId))
    })

    socket.on('sendMessage', ({targetUserName, message}) => {
        io.to(userNameToSocketId[targetUserName]).emit('message', ({targetUserName, message}))
    })

    socket.on('disconnect', () => {
        var userName = socketIdToUserName[socket.id]

        delete userNameToSocketId[userName]
        delete socketIdToUserName[socket.id]

        console.log(userNameToSocketId)
        console.log(socketIdToUserName)
    })
})

server.listen(4000, function () {
    console.log('listening on port 4000');
})