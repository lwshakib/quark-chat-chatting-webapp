"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: any) => any;
  messages: string[];
  setMessages: (messages: any[]) => void;
  joinRoom: (conversationId: string) => void;
  leaveRoom: (conversationId: string) => void;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: any) => {
    console.log("From Server Msg Rec", msg);
    const { message } = JSON.parse(msg) as { message: string };
    setMessages((prev) => [...prev, message]);
  }, []);

  const joinRoom = (conversationId: string) => {
    if (socket) {
      socket.emit("room:join", { conversationId });
    }
  };

  const leaveRoom = (conversationId: string) => {
    if (socket) {
      socket.emit("room:leave", { conversationId });
    }
  };

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);

    setSocket(_socket);

    return () => {
      _socket.off("message", onMessageRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, setMessages, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
