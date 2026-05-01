package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.CodeUpdateMessage;

import com.collab.DevHive.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.TimeUnit;

@Controller
@RequiredArgsConstructor
public class CodeSyncController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;

    private final StringRedisTemplate template;
    private static final String ROOM_CODE_KEY = "room:";
    private static final long ROOM_TTL_HOURS = 2;

    @MessageMapping("/code-update/{roomId}")
    public void handleCodeUpdate(
            @DestinationVariable String roomId,
            @Payload CodeUpdateMessage message

    ) {


//        UpdateCodeRequestDto dto = new UpdateCodeRequestDto();
//        dto.setCode(message.getCode());


        //dont hit db hit cache
        String key = ROOM_CODE_KEY + roomId;
        template.opsForValue().set(key, message.getCode(), ROOM_TTL_HOURS, TimeUnit.HOURS);




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