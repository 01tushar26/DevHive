package com.collab.DevHive.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JoinVideoCallResponseDTO {
    private String url;
    private String token;
}
