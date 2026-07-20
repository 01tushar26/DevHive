package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.JoinVideoCallResponseDTO;

public interface LiveKitService {

    JoinVideoCallResponseDTO videoCallRequest(String roomId);
}
