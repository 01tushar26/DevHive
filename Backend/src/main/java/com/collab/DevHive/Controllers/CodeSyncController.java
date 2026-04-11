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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

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
      // this update method is authentivcayed

        UpdateCodeRequestDto dto = new UpdateCodeRequestDto();
        dto.setCode(message.getCode());

        //for persistent
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