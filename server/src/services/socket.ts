import Redis from "ioredis";
import { Server } from "socket.io";
import { produceMessage } from "./kafka";

const pub = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "0"),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
  });
  
  const sub = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "0"),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
  });
  

class SocketService{
    private _io: Server;
    constructor(){
        console.log('Init socket service');
        
        this._io = new Server({
            cors:{
                origin: "*",
                allowedHeaders: ["*"]
            }
        })
        sub.subscribe('MESSAGES')
    }

    public initListeners(){
        const io = this.io;
        console.log('Init socket listeners');
        io.on("connect", (socket) => {
            console.log('Client connected', socket.id);



            socket.on('room:join', async(data) => {
                console.log('Client joined', data);
                await socket.join(data.conversationId);
            })

            socket.on('room:leave', async(data) => {
                console.log('Client left', data);
                await socket.leave(data.conversationId);
            })


            socket.on('event:message', async(data) => {
                console.log('Event received', data);
                await pub.publish("MESSAGES", JSON.stringify(data));
            })

            socket.on("disconnect", () => {
                console.log('Client disconnected', socket.id);
                
            })
        })

        sub.on("message", async(channel, message) => {
            console.log('Message received', message);
            const parsedMessage = JSON.parse(message);
            io.to(parsedMessage?.message?.conversationId).emit("message", message);
            await produceMessage(message);
        })
        
    }

    get io(): Server{
        return this._io;
    }
}

export default SocketService;
