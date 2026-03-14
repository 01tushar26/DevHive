package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.RoomRequestDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;

public interface RoomService {

    RoomResponseDto createRoom(RoomRequestDto dto);
    RoomResponseDto joinRoom( RoomRequestDto dto, String roomID);
    RoomResponseDto getRoom(String roomID);
    void updateCode(String roomId, UpdateCodeRequestDto dto);
}
