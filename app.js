// path : chat/server/index.js

const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server,{
  cors : {
    origin :"*",
    credentials :true
  }
});

const userNameToSocketId = {}
const socketIdToUserName = {}


io.on('connection', socket=>{
  console.log('소켓 연결됨')
  socket.on('login',({userName}) => {
    console.log('로그인', socket.id)
    console.log('로그인', userName)
    userNameToSocketId[userName] = socket.id
    socketIdToUserName[socket.id] = userName
    console.log(userNameToSocketId)
    console.log(socketIdToUserName)
  })
  socket.on('sendMessage',({targetUserName, message}) => {
    console.log('메세지 수신', targetUserName, message)
    io.to(userNameToSocketId[targetUserName]).emit('message',({message}))
  })
  socket.on('disconnect', () => {
    console.log('소켓 연결 종료', socket)
    console.log('소켓 연결 종료')
    var userName = socketIdToUserName[socket.id]

    delete userNameToSocketId[userName]
    delete socketIdToUserName[socket.id]

    console.log(userNameToSocketId)
    console.log(socketIdToUserName)
  })
})

server.listen(4000, function(){
  console.log('listening on port 4000');
})