package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.JoinVideoCallResponseDTO;
import com.collab.DevHive.DTO.RoomEventDto;
import com.collab.DevHive.DTO.VideoCallEventDTO;
import com.collab.DevHive.Service.LiveKitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/livekit")
@RequiredArgsConstructor
public class LiveKitController {


    private final LiveKitService service;
    private final SimpMessagingTemplate simpMessagingTemplate;

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


            VideoCallEventDTO event = new VideoCallEventDTO(roomId,"VC_STARTED");

            simpMessagingTemplate.convertAndSend(
                    "/topic/room/" + roomId,
                    event
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
