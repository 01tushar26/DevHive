package com.collab.DevHive.DTO;

import lombok.Data;

@Data
public class CrdtUpdateMessage {
    private String roomId;
    private String username;
    //two option send the whole code via this or simply send the current operation then concatenate with previous db stored state
    private String update;   // Base64-encoded Yjs binary update
    private String type;  // type is update or awareness
}
