import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs"

let stompClient = null;

export const connectSocket = (roomId, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/api/v1/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("Connected");

      // subscribe to room
      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data);
      });
    },

    onStompError: (frame) => {
      console.error("Broker error:", frame);
    },
  });

  stompClient.activate();
};

export const sendCodeUpdate = (roomId, code, username = "anonymous") => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/code-update/${roomId}`,
      body: JSON.stringify({
        roomId,
        code,
        username,
      }),
    });
  }
};