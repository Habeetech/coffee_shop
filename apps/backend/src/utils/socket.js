import { Server } from "socket.io";
import AppError from "./AppError.js";


let io;

export function  init (server) {
    io = new Server(server, { cors: {
        origin: ['https://coffee-shop-frontend-two-zeta.vercel.app', 'http://localhost:3000'],
        methods: ["GET", "POST"],
        credentials: true
    }})

    io.on("connection", (socket) =>
    {
        console.log(`Client connected: ${socket.id}`);
        socket.on("join_room", (data) =>
        {
             socket.join(data?.userId);
        })
       
    })
}

export function getIo () {
    if(!io) {
        throw new AppError("Socket.io not initialized", 500);
    }
return io;
}