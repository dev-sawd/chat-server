const app = require('express')()
const server = require('http').createServer(app)
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
        // 이미 존재하는 아이디 체크
        if(!userNameToSocketId.hasOwnProperty(userName)) {
            userNameToSocketId[userName] = socket.id
            socketIdToUserName[socket.id] = userName
            socket.broadcast.emit('loginUser', userName)
            socket.emit('returnLoginResponse', true,Object.keys(userNameToSocketId))
        } else {
            socket.emit('returnLoginResponse', false, null)
        }
    })

    socket.on('sendMessage', ({sendUserName, targetUserName, message}) => {
        // 다른사람에게 보내는 메세지일때
        if (sendUserName === targetUserName) {
            io.to(userNameToSocketId[targetUserName]).emit('message', ({sendUserName, targetUserName, message}))
        } else {
            io.to(userNameToSocketId[sendUserName]).emit('message', ({sendUserName, targetUserName, message}))
            io.to(userNameToSocketId[targetUserName]).emit('message', ({sendUserName, targetUserName, message}))
        }
    })

    socket.on('disconnect', () => {
        // 로그아웃 처리
        var userName = socketIdToUserName[socket.id]

        delete userNameToSocketId[userName]
        delete socketIdToUserName[socket.id]

        socket.broadcast.emit('logoutUser', userName)
    })
})

server.listen(4000, function () {
    console.log('listening on port 4000');
})