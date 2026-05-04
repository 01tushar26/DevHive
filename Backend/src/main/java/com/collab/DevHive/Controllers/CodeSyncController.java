package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.CodeUpdateMessage;

import com.collab.DevHive.Service.RedisService.RedisMessagePublisher;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import tools.jackson.databind.ObjectMapper;

import java.util.concurrent.TimeUnit;

import static com.collab.DevHive.Util.Util.ROOM_CODE_KEY;
import static com.collab.DevHive.Util.Util.ROOM_TTL_HOURS;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CodeSyncController {


    private final StringRedisTemplate template;
    private final RedisMessagePublisher publisher;
    private final ObjectMapper objectMapper;





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



        try {
            // Make sure roomId is in the message so subscriber knows the topic
            message.setRoomId(roomId);
            String json = objectMapper.writeValueAsString(message);
            publisher.publish(json);
        } catch (Exception e) {
            log.error("Failed to publish code update for room {}: {}", roomId, e.getMessage());
        }
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