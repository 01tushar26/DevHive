package com.collab.DevHive.DTO;

import lombok.Data;

@Data
public class LanguageUpdateMessage {

    private String roomId;
    private String language;
    private String username;
    private final String message = "LANG_UPDATE";

}
