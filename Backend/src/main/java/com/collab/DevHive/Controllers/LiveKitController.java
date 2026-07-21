package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.JoinVideoCallResponseDTO;
import com.collab.DevHive.Service.LiveKitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/livekit")
@RequiredArgsConstructor
public class LiveKitController {


    private final LiveKitService service;

    @PostMapping("/token/{roomId}")
    public ResponseEntity<JoinVideoCallResponseDTO> joinVideoCall(@PathVariable (name = "roomId") String roomId){
        try {
            return ResponseEntity.ok( service.videoCallRequest(roomId));
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    }

}
