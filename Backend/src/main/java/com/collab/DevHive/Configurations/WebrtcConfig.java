package com.collab.DevHive.Configurations;

import io.livekit.server.RoomServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebrtcConfig {

    @Value("${livekit.api-key}")
    private String apiKey;

    @Value("${livekit.api-secret}")
    private String apiSecret;

    @Value("${livekit.server-url}")
    private String serverUrl;

    @Bean
    public RoomServiceClient getRoomClientService(){
        return RoomServiceClient.createClient(serverUrl,apiKey,apiSecret);
    }
}
