package com.collab.DevHive.Service.RedisService;

import com.collab.DevHive.DTO.CodeUpdateMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisMessageSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;


    //this will automatically run when there is event in redis pubsub
    @Override
    public void onMessage(Message message, byte @Nullable [] pattern) {
        try {
            String json = new String(message.getBody());
            CodeUpdateMessage codeUpdate = objectMapper.readValue(json, CodeUpdateMessage.class);

            //this will send the message to all the subscriber
            messagingTemplate.convertAndSend(
                    "/topic/room/" + codeUpdate.getRoomId(),
                    codeUpdate
            );

            log.debug("Broadcast from Redis → /topic/room/{}", codeUpdate.getRoomId());

        } catch (Exception e) {
            log.error("Failed to process Redis message: {}", e.getMessage());
        }
    }
}
