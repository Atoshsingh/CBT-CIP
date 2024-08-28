import {Server} from "socket.io";
//first we have to create http server  and then all things will work
import express from 'express'
import http from "http";

const app = express();

const server = http.createServer(app);

//creating obj of server 
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','PSOT']
    }
})

//Making an object for that user which is Passing some content  or will store the sochot id correspondinngg to the user id
//jis jis user ka shocket id hoga us us user ko oln show krenge page pe 
const userSocketMap = {}; //
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];


io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
        console.log(`User connected: UserId = ${userId} , SocketId = ${socket.id}`)
    }
    //frontend will listen
    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        if(userId){
            console.log(`User disconnected: UserId = ${userId} , SocketId = ${socket.id}`)
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
});

export {app , server , io};


