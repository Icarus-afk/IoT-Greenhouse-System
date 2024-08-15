// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import WebSocketManager from './WebSocketManager';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState({});

  const addMessage = (name, message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [name]: [...(prevMessages[name] || []), message],
    }));
  };

  useEffect(() => {
    const handleMessage = (name) => (message) => {
      addMessage(name, message);
    };

    Object.keys(WebSocketManager.sockets).forEach((name) => {
      WebSocketManager.addListener(name, handleMessage(name));
    });

    return () => {
      Object.keys(WebSocketManager.sockets).forEach((name) => {
        WebSocketManager.removeListener(name, handleMessage(name));
      });
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ WebSocketManager, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};