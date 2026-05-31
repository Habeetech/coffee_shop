import { Server } from "socket.io";
import AppError from "./AppError.js";


let io;

export function  init (server) {
    const client = process.env.FRONTEND_URLS;
    console.log("client", client)
    io = new Server(server, { cors: {
        origin: client,
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