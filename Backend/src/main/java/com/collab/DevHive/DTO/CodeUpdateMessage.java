package com.collab.DevHive.DTO;

import lombok.Data;

@Data
public class CodeUpdateMessage {
    private String roomId;
    private String code;
    private final String message = "CODE_UPDATE";
}
