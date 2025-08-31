import express, { Application } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import appRoutes from './src/globals/routes/appRoute';
class Server {

    private app: Application;
    private server: any;
    private io: SocketIOServer;

    public constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*", // Configure this for production
                methods: ["GET", "POST"]
            }
        });
        
        // Enable CORS for all HTTP routes
        this.app.use(cors({
            origin: "http://localhost:3000", // React app URL
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));
        
        this.app.use(express.json());
    }

    public start() {
        this.setupSocketEvents();
        this.listenServer();
        this.setupRoutes();
    }

    public setupRoutes() {
        appRoutes(this.app)
    }


    private setupSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            // Join user to a general room for global updates
            socket.join('global');

            // Handle joining specific list rooms
            socket.on('join_list', (listId: string) => {
                socket.join(`list_${listId}`);
                console.log(`User ${socket.id} joined list ${listId}`);
            });

            // Handle leaving specific list rooms
            socket.on('leave_list', (listId: string) => {
                socket.leave(`list_${listId}`);
                console.log(`User ${socket.id} left list ${listId}`);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }

    public getIO(): SocketIOServer {
        return this.io;
    }

    private listenServer() {
        const port = 4000;

        this.server.listen(port, () =>{
            console.log('Socket.IO server connected to port: ', port)
        })
    }
}

export default Server;