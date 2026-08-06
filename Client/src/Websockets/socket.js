import SockJS from "sockjs-client/dist/sockjs.min";
import { Client } from "@stomp/stompjs"
import { toast } from "sonner";

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

export const sendCodeUpdate = (roomId, code) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/code-update/${roomId}`,
      body: JSON.stringify({
        roomId,
        code,
      }),
    });
  }
};
export const sendLanguageUpdate = (roomId, language) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/lang-update/${roomId}`,   
      body: JSON.stringify({ roomId, language }),
    });
  }
};
export const sendWhiteboardUpdate = (roomId, elements) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/whiteboard-update/${roomId}`,
      body: JSON.stringify({
        roomId,
        elements: JSON.stringify(elements), // backend expects elements as a String
      }),
    });
  }
};
//when you delete the room this function disconnect the websocket persistence connection
export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("WebSocket disconnected");
  }
};