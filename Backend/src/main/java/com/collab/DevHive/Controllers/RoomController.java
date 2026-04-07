package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.RoomRequestDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;
import com.collab.DevHive.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService service;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping
    public ResponseEntity<RoomResponseDto> createRoom(@RequestBody RoomRequestDto dto){
        RoomResponseDto responseDto = service.createRoom(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

//    @PostMapping("/{roomId}/join")
//    public ResponseEntity<RoomResponseDto> joinRoom(@PathVariable(name = "roomId") String id, @RequestBody RoomRequestDto dto){
//        RoomResponseDto responseDto = service.joinRoom(dto,id);
//        return ResponseEntity.ok(responseDto);
//    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<RoomResponseDto> joinRoom(@PathVariable(name = "roomId") String id , @RequestBody RoomRequestDto dto){
        RoomResponseDto responseDto = service.joinRoom(id , dto.getUserName());
        return ResponseEntity.ok(responseDto);
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

        //this will check on socket.js while before calling disConnect socket
        //this is to send the message to websocket connect that room has been ended pls close the connection
        simpMessagingTemplate.convertAndSend(
                "/topic/room/" + roomId,
                responseDto
        );
        return ResponseEntity.ok(responseDto);
    }

}
