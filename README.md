# Dev Hive — Live Collaborative Code Editor

A real-time collaborative code editor where multiple users can join a room and write code together, with changes synced instantly across all connected clients.
 
---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TailwindCSS |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| WebSocket Client | SockJS + STOMP.js (`@stomp/stompjs`) |
| HTTP Client | Axios |
| Backend | Spring Boot |
| Real-time Protocol | WebSocket + STOMP |

## Websocket Architecture
<p align="center">
  <img src="assets/image.png" alt="Devhive Websockets Architecture" width="1006"/>
</p>

