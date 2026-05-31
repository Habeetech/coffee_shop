import { createContext, useEffect, useState, useContext } from "react";
import useUserStore from "../store/useUserStore";
import { io } from "socket.io-client"

const SocketContext = createContext(null);



export function SocketProvider({ children }) {
    const server = import.meta.env.VITE_API_URL;
    const [socket, setSocket] = useState(null);
    const user = useUserStore(s => s.user);

    useEffect(()=> {
        let connection;
        if (user?._id) {
            connection = io(server);
            setSocket(connection);
            connection?.emit("join_room", { userId: user._id})
        }
        return () => {
            connection?.disconnect();
            setSocket(null);
        }
    }, [user, server])
    return(<SocketContext.Provider
    value={socket}
    >
        {children}
    </SocketContext.Provider>)
}


export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}


export default useSocket;