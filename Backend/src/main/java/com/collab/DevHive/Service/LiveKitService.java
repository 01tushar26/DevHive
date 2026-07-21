package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.JoinVideoCallResponseDTO;

import java.io.IOException;

public interface LiveKitService {

    JoinVideoCallResponseDTO videoCallRequest(String roomId) ;
    void closeVideoCall(String roomId);
    void removeParticipant(String roomId, String identity);
}
