package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.LeaveJoinRoomResponseDto;

import com.collab.DevHive.DTO.RoomEndMessage;
import com.collab.DevHive.DTO.RoomEventDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.Service.RedisService.RedisMessagePublisher;
import com.collab.DevHive.Service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@Slf4j
public class RoomController {

    private final RoomService service;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ObjectMapper objectMapper;
    private final RedisMessagePublisher publisher;

    @PostMapping
    public ResponseEntity<RoomResponseDto> createRoom(){
        RoomResponseDto responseDto = service.createRoom();
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

//    @PostMapping("/{roomId}/join")
//    public ResponseEntity<RoomResponseDto> joinRoom(@PathVariable(name = "roomId") String id, @RequestBody RoomRequestDto dto){
//        RoomResponseDto responseDto = service.joinRoom(dto,id);
//        return ResponseEntity.ok(responseDto);
//    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<RoomResponseDto> joinRoom(@PathVariable(name = "roomId") String id){
        LeaveJoinRoomResponseDto leaveJoinRoomResponseDto = service.joinRoom(id);
        RoomEventDto event = leaveJoinRoomResponseDto.getEventDto();


        try {
            // Make sure roomId is in the message so subscriber knows the topic
            event.setRoomId(id);
            String json = objectMapper.writeValueAsString(event);
            publisher.publish(json);
        } catch (Exception e) {
            log.error("Failed to publish join update for room {}: {}", id, e.getMessage());
        }


        return ResponseEntity.ok(leaveJoinRoomResponseDto.getRoomResponseDto());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponseDto> getRoom(@PathVariable(name = "roomId") String id){
        RoomResponseDto responseDto = service.getRoom(id);
        return ResponseEntity.ok(responseDto);
    }

    // not usefull in case of websocket it do it automatically but for future
//    @PatchMapping("/{roomId}/code")
//    public ResponseEntity<Void> updateCode(@PathVariable(name = "roomId") String id, @RequestBody UpdateCodeRequestDto dto) {
//        service.updateCode(id, dto);
//        return ResponseEntity.noContent().build();
//    }

    @DeleteMapping("/{roomId}/end")
    public ResponseEntity<RoomResponseDto> endRoom(@PathVariable String roomId){
        RoomResponseDto responseDto = service.endRoom(roomId);

        RoomEndMessage message = new RoomEndMessage(roomId);

        try {
            // Make sure roomId is in the message so subscriber knows the topic
            message.setRoomId(roomId);
            String json = objectMapper.writeValueAsString(message);
            publisher.publish(json);
        } catch (Exception e) {
            log.error("Failed to publish end room message for room {}: {}", roomId, e.getMessage());
        }

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{roomId}/leave")
    public ResponseEntity<RoomResponseDto> leaveRoom(@PathVariable String roomId){
        LeaveJoinRoomResponseDto leaveJoinRoomResponseDto = service.leaveRoom(roomId);

        RoomEventDto event = leaveJoinRoomResponseDto.getEventDto();


        try {
            // Make sure roomId is in the message so subscriber knows the topic
            event.setRoomId(roomId);
            String json = objectMapper.writeValueAsString(event);
            publisher.publish(json);
        } catch (Exception e) {
            log.error("Failed to publish leave message for room {}: {}", roomId, e.getMessage());
        }




        return ResponseEntity.ok(leaveJoinRoomResponseDto.getRoomResponseDto());
    }

}
