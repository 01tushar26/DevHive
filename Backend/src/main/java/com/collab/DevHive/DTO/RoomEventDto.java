package com.collab.DevHive.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomEventDto {

    private String userName;
    private Long id;
    private String message;
}
