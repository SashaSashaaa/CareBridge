import { useEffect, useRef, useState } from "react";
 
function getWsBaseUrl() {
  if (import.meta.env.DEV) {
    return "ws://localhost:3000";
  }
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}`;
}
 
export function useChatSocket(chatId, onMessage) {
  const socketRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const [isConnected, setIsConnected] = useState(false);
 
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
 
  useEffect(() => {
    if (!chatId) return;
 
    const token = localStorage.getItem("access");
    const wsBaseUrl = getWsBaseUrl();
    const socket = new WebSocket(
      `${wsBaseUrl}/ws/chat/${chatId}/?token=${token}`
    );
 
    socketRef.current = socket;
 
    socket.onopen = () => {
      setIsConnected(true);
      console.log("Chat WS connected");
    };
 
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onMessageRef.current) {
        onMessageRef.current(data);
      }
    };
 
    socket.onerror = (error) => {
      console.log("Chat WS error:", error);
    };
 
    socket.onclose = () => {
      setIsConnected(false);
      console.log("Chat WS closed");
    };
 
    return () => {
      socket.close();
    };
  }, [chatId]);
 
  const sendMessage = (text) => {
    if (!socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ type: "message", text }));
  };
 
  const sendTyping = (isTyping) => {
    if (!socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ type: "typing", is_typing: isTyping }));
  };
 
  const sendRead = () => {
    if (!socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ type: "read" }));
  };
 
  return {
    isConnected,
    sendMessage,
    sendTyping,
    sendRead,
  };
}
 
export function useNotificationSocket(onNotification) {
  const onNotificationRef = useRef(onNotification);
 
  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);
 
  useEffect(() => {
    const token = localStorage.getItem("access");
    const wsBaseUrl = getWsBaseUrl();
    const socket = new WebSocket(
      `${wsBaseUrl}/ws/chat/notifications/?token=${token}`
    );
 
    socket.onopen = () => console.log("Notification WS connected");
 
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onNotificationRef.current) {
        onNotificationRef.current(data);
      }
    };
 
    socket.onerror = (error) => console.log("Notification WS error:", error);
    socket.onclose = () => console.log("Notification WS closed");
 
    return () => socket.close();
  }, []);
}