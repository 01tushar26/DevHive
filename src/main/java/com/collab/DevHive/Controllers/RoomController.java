package com.collab.DevHive.Controllers;

import com.collab.DevHive.DTO.RoomRequestDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;
import com.collab.DevHive.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService service;

    @PostMapping
    public ResponseEntity<RoomResponseDto> createRoom(@RequestBody RoomRequestDto dto){
        RoomResponseDto responseDto = service.createRoom(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<RoomResponseDto> joinRoom(@PathVariable(name = "roomId") String id, @RequestBody RoomRequestDto dto){
        RoomResponseDto responseDto = service.joinRoom(dto,id);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponseDto> getRoom(@PathVariable(name = "roomId") String id){
        RoomResponseDto responseDto = service.getRoom(id);
        return ResponseEntity.ok(responseDto);
    }
    @PatchMapping("/{roomId)/code")
    public ResponseEntity<Void> getRoom(@PathVariable(name = "roomId") String id, @RequestBody UpdateCodeRequestDto dto) {
        service.updateCode(id, dto);
        return ResponseEntity.noContent().build();
    }




}
