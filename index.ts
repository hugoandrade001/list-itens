import Server from "./server";
import SocketManager from "./src/globals/socket/socketManager";

class AppApplication {

    public run() {
        const server = new Server()
        
        const socketManager = SocketManager.getInstance()
        socketManager.setIO(server.getIO())
        
        server.start()
    } 
}

const appApplication: AppApplication = new AppApplication()
appApplication.run()