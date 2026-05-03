package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.LeaveJoinRoomResponseDto;
import com.collab.DevHive.DTO.RoomRequestDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;

public interface RoomService {

    RoomResponseDto createRoom(RoomRequestDto dto);
    LeaveJoinRoomResponseDto joinRoom(String roomID, String userName);
    RoomResponseDto getRoom(String roomID);
//    void updateCode(String roomId, String dto);
    RoomResponseDto endRoom(String roomId);
    LeaveJoinRoomResponseDto leaveRoom(String roomId);



}
