package com.collab.DevHive.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WhiteBoardUpdateMessage {
    private String roomId;
    private String elements;
    private final String message ="WB_UPDATE";
}
