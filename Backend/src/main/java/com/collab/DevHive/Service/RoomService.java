package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.LeaveJoinRoomResponseDto;
import com.collab.DevHive.DTO.RoomRequestDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;

public interface RoomService {

    RoomResponseDto createRoom();
    LeaveJoinRoomResponseDto joinRoom(String roomID);
    RoomResponseDto getRoom(String roomID);
//    void updateCode(String roomId, String dto);
    RoomResponseDto endRoom(String roomId);
    LeaveJoinRoomResponseDto leaveRoom(String roomId);


    void langUpdate(String roomId, String language);
}
