package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.CodeUpdateMessage;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;
import com.collab.DevHive.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class CodeSyncController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;

    @MessageMapping("/code-update")
    public void handleCodeUpdate(@Payload CodeUpdateMessage message) {

        UpdateCodeRequestDto dto = new UpdateCodeRequestDto();
        dto.setCode(message.getCode());

        // Save latest code snapshot
        roomService.updateCode(message.getRoomId(),dto);

        // Broadcast update to everyone in the room
        messagingTemplate.convertAndSend(
                "/topic/room/" + message.getRoomId(),
                message
        );
    }
}

//WebSocket endpoint:
//ws://localhost:8080/ws
//client → /app/*
//server → /topic/*
//Frontend(client) sends WebSocket message
//      ↓
// app/code-update
//      ↓
//CodeSyncController receives it
//      ↓
//updateCode() saves snapshot
//      ↓
//broadcast to /topic/room/{roomId}  (server send the message )
//      ↓
//all users in room receive update