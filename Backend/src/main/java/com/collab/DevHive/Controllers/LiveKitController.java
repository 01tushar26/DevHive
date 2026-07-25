package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.JoinVideoCallResponseDTO;
import com.collab.DevHive.DTO.VideoCallMessage;
import com.collab.DevHive.Service.LiveKitService;
import com.collab.DevHive.Service.RedisService.RedisMessagePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/livekit")
@RequiredArgsConstructor
@Slf4j
public class LiveKitController {


    private final LiveKitService service;
    private final RedisMessagePublisher publisher;
    private final ObjectMapper objectMapper;

    @PostMapping("/token/{roomId}")
    public ResponseEntity<JoinVideoCallResponseDTO> joinVideoCall(@PathVariable (name = "roomId") String roomId){
        try {
            return ResponseEntity.ok( service.videoCallRequest(roomId));
        } catch ( Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/start/{roomId}")
    public ResponseEntity<JoinVideoCallResponseDTO> startVideoCall(@PathVariable(name = "roomId") String roomId){
        try {
            // validates membership, creates the LiveKit room, returns the initiator's own token
            JoinVideoCallResponseDTO response = service.videoCallRequest(roomId);


            VideoCallMessage event = new VideoCallMessage(roomId);

            try {
                // Make sure roomId is in the message so subscriber knows the topic
                event.setRoomId(roomId);
                String json = objectMapper.writeValueAsString(event);
                publisher.publish(json);
            } catch (Exception e) {
                log.error("Failed to publish language update for room {}: {}", roomId, e.getMessage());
            }



            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
