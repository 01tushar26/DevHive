# Dev Hive - Interview in real-time, code in sync

---
DevHive is a live collaborative code editor with built-in video calling. Run mock interviews, pair-program with your team, or grind DSA with friends — all face-to-face in one room.

**Live Demo:** 

<p align="center">
  <img src="assets/home.png" alt="Learnify Architecture" width="1772"/>
</p>

<p align="center">
  <img src="assets/editor.png" alt="Learnify Architecture" width="1772"/>
</p>

---

## Features

---


- **Real-Time Code Collaboration** — Monaco Editor synced live across all room participants via WebSocket
- **Video & Audio Calling** — LiveKit-powered WebRTC integration directly inside coding rooms
- **WebSocket Messaging** — STOMP over SockJS for bi-directional client-server communication
- **Redis Write-Through Cache** — live code/language updates hit Redis first, avoiding DB writes on every keystroke
- **Scheduled DB Sync** — background cron job (every 30s) persists cached Redis code back to the database
- **Redis Pub/Sub Broadcasting** — decouples publisher/subscriber for horizontally scalable, multi-instance WebSocket delivery
- **Collision-Safe Room IDs** — auto-generated unique room IDs with retry logic on conflict
- **Concurrency-Safe Joins** — pessimistic locking prevents race conditions when multiple users join simultaneously
- **Reconnect Handling** — rejoining users get re-synced state (`USER_REJOIN`) instead of duplicate participant entries
- **Live Room Events** — real-time broadcasts for user joined, left, rejoined, and room closed
- **JWT Authentication** — short-lived access tokens + long-lived refresh tokens (6 months) in HTTP-only cookies
- **Role-Based LiveKit Tokens** — per-user JWT tokens with admin grants for room owners
- **Automatic Call Lifecycle Management** — LiveKit room auto-created on call start, cleaned up on room end, participants auto-removed on leave
- **Cache-Aside Fallback** — graceful handling and logging of Redis cache misses with DB fallback
- **Global Exception Handling** — custom exceptions (`ResourceNotFoundException`, `RoomNotAvailableException`, `AccessDeniedException`) for consistent error responses
- **Modular Service Architecture** — clean separation across Room, User, LiveKit, and Redis services


---


## Tech Stack

---

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TailwindCSS |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| WebSocket Client | SockJS + STOMP.js (`@stomp/stompjs`) |
| Video Calling | WebRTC (SFU topology) via LiveKit |
| Backend | Spring Boot |
| Real-time | WebSocket + STOMP |
| Cache / Pub-Sub | Redis |
| Database | PostgreSQL (Spring Data JPA) |
| Auth | JWT + Refresh Token (HttpOnly Cookie) |
 
---

## Architecture

---

---



## API Reference

---

### Auth — `/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login; sets HttpOnly refresh token cookie |
| `POST` | `/auth/refresh` | Rotate access + refresh token |
| `POST` | `/auth/logout` | Revoke token + clear cookie |


---


### Rooms — `/rooms`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/rooms` | Create a room (caller becomes OWNER) |
| `POST` | `/rooms/{roomId}/join` | Join as EDITOR |
| `GET` | `/rooms/{roomId}` | Get room info (live code from Redis if available) |
| `DELETE` | `/rooms/{roomId}/end` | Owner ends room; final Redis → DB sync |
| `DELETE` | `/rooms/{roomId}/leave` | Participant leaves room |

---

### WebSocket 

| Direction | Destination | Description                                                            |
|-----------|-------------|------------------------------------------------------------------------|
| Client → Server | `/app/code-update/{roomId}` | Send a code change                                                     |
| Server → Client | `/topic/room/{roomId}` | Receive updates, join/leave events, video call events, room-end signal |


---


### Livekit


---

## Running Locally



---