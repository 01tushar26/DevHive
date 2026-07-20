package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.JoinVideoCallResponseDTO;
import io.livekit.server.RoomServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveKitServiceImpl implements LiveKitService {

    private final RoomServiceClient roomServiceClient;

    @Value("${livekit.api-key}")
    private String apiKey;

    @Value("${livekit.api-secret}")
    private String apiSecret;

    @Value("${livekit.server-url}")
    private String serverUrl;

    @Override
    public JoinVideoCallResponseDTO videoCallRequest(String roomId) {

        return new JoinVideoCallResponseDTO();
    }
}
