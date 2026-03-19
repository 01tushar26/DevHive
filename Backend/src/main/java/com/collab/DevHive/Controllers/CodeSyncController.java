package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.CodeUpdateMessage;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;
import com.collab.DevHive.Entities.Room;
import com.collab.DevHive.Exceptions.ResourceNotFoundException;
import com.collab.DevHive.Repositories.RoomRepository;
import com.collab.DevHive.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class CodeSyncController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;
    private final RoomRepository roomRepo;

    @MessageMapping("/code-update/{roomId}")
    public void handleCodeUpdate(
            @DestinationVariable String roomId,
            @Payload CodeUpdateMessage message
    ) {

        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        UpdateCodeRequestDto dto = new UpdateCodeRequestDto();
        dto.setCode(message.getCode());

        
        roomService.updateCode(roomId, dto);

       //client subscribe from that url
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId,
                message
        );
    }
}

//WebSocket endpoint:
//ws://localhost:8080/api/v1/ws
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

// to delete the connect used the stomp.deacticate