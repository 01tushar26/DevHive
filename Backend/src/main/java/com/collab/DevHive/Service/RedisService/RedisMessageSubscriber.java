package com.collab.DevHive.Service.RedisService;

import com.collab.DevHive.DTO.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisMessageSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    //Todo- esuner every wbe
    //this will automatically run when there is event in redis pubsub
    @Override
    public void onMessage(Message message, byte @Nullable [] pattern) {
        try {
            String json = new String(message.getBody());
            JsonNode node = objectMapper.readTree(json);
            String type = node.has("message") ? node.get("message").asText() : null;

            if ("LANG_UPDATE".equals(type)) {
                LanguageUpdateMessage langUpdate = objectMapper.readValue(json, LanguageUpdateMessage.class);
                messagingTemplate.convertAndSend(
                        "/topic/room/" + langUpdate.getRoomId(),
                        langUpdate
                );
                log.info("Broadcast LANG_UPDATE from Redis → /topic/room/{}", langUpdate.getRoomId());

            } else if ("CODE_UPDATE".equals(type)) {
                CodeUpdateMessage codeUpdate = objectMapper.readValue(json, CodeUpdateMessage.class);
                messagingTemplate.convertAndSend(
                        "/topic/room/" + codeUpdate.getRoomId(),
                        codeUpdate
                );
                log.info("Broadcast CODE_UPDATE from Redis → /topic/room/{}", codeUpdate.getRoomId());

            } else if ("VC_STARTED".equals(type)) {
                VideoCallMessage eventDTO = objectMapper.readValue(json, VideoCallMessage.class);

                messagingTemplate.convertAndSend(
                        "/topic/room/" + eventDTO.getRoomId(),
                        eventDTO
                );
                log.info("Broadcast VC Started from Redis → /topic/room/{}", eventDTO.getRoomId());

            } else if ("USER_JOIN".equals(type) || "USER_REJOIN".equals(type) || "USER_LEFT".equals(type) ) {
                RoomEventDto eventDTO = objectMapper.readValue(json, RoomEventDto.class);

                messagingTemplate.convertAndSend(
                        "/topic/room/" + eventDTO.getRoomId(),
                        eventDTO
                );
                log.info("Broadcast User JOIN/REJOIN/LEFT from redis → /topic/room/{}", eventDTO.getRoomId());

            } else if ("ROOM_ENDED".equals(type) ) {
                RoomEndMessage eventDTO = objectMapper.readValue(json,RoomEndMessage.class);

                messagingTemplate.convertAndSend(
                        "/topic/room/" + eventDTO.getRoomId(),
                        eventDTO
                );
                log.info("Broadcast Room ENDED from redis → /topic/room/{}", eventDTO.getRoomId());

            } else if ("WB_UPDATE".equals(type) ) {
                WhiteBoardUpdateMessage eventDTO = objectMapper.readValue(json,WhiteBoardUpdateMessage.class);

                messagingTemplate.convertAndSend(
                        "/topic/room/" + eventDTO.getRoomId(),
                        eventDTO
                );
                log.info("Broadcast whiteBoard update from redis → /topic/room/{}", eventDTO.getRoomId());

            } else {
                log.warn("Unknown message type on Redis channel: {}", type);
            }

        } catch (Exception e) {
            log.error("Failed to process Redis message: {}", e.getMessage());
        }
    }
}
