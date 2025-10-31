require('dotenv').config()
const express=require('express')
const http=require('http')
const socketIo=require('socket.io')

const app=express()


const server=http.createServer(app)

//initiate socket.io with http server
const io=socketIo(server)
//serve the static file from the public directory
app.use(express.static('public'))

const users=new Set()

io.on('connection',(socket)=>{
    console.log('a user is now connected')

    //handle users when they will join the chat
    socket.on('join',(userName)=>{
        users.add(userName)

        //broadcast to all users that a new user has joined
        io.emit('userJoined',userName)
        //send the updated userlist to all the clients
        io.emit('userList',Array.from(users))

    })

    //handle incoming chat messages
    socket.on('chatMessage',(message)=>{
        //broadcast the chat to all
         io.emit('chatMessage',message)
    })
    //handle user disconnection
    
})

server.listen(process.env.PORT,()=>{
    console.log(`server is now running http://localhost:${process.env.PORT}`)
})