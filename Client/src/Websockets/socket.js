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

        if (data.status === "CLOSED") {
          // endRoom — disconnect all and redirect
          disconnectSocket();
          window.location.href = 'http://localhost:5173/';

        } else if (data.message === "USER_LEFT") {
          // leaveRoom — show notification, update participant list
          toast.success(`${data.userName} left the room`);
          onMessageReceived(data);  // handle UI update in the component

        } else if (data.message === "USER_JOIN") {
          // joinRoom — show notification, update participant list
          toast.success(`${data.userName} joined the room`);
          onMessageReceived(data);  // handle UI update in the component

        } else {
          // code update or other messages
          console.log('message !' , data)
          onMessageReceived(data);
        }
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
//when you delete the room this function disconnect the websocket persistence connection
export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("WebSocket disconnected");
  }
};