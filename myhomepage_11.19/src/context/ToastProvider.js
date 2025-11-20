import {createContext, useContext, useEffect, useState} from "react";
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';


const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    return context;
}

const ToastProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // 웹 소켓 연결 설정
        const socket = new SockJS("http://localhost:8085/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,  // 5초동안 기다림
        });
        client.onConnect = () => {
            console.log("✅ 웹소켓 연결 성공");
            client.subscribe("/topic/notifications", (msg) => {
                const n = JSON.parse(msg.body);
                console.log("🔔 받은 알림: ", n);

                // 알림 추가
                setNotifications(p => [...p, {
                    id: Date.now(),
                    ...n,
                    read:false
                }]);
            });
        };

        client.onStompError = () => {
            alert("연결 실패");
        };

        client.activate();
        // 연결 해제
        return () => {
            client.deactivate();
        }
    }, [])

    const value = {
        notifications
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    )
}

export default ToastProvider;