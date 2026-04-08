package com.collab.DevHive.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveJoinRoomResponseDto {
    private RoomResponseDto roomResponseDto;
    private RoomEventDto eventDto;
}
