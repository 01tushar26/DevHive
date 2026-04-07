package com.collab.DevHive.DTO;

import lombok.Data;

@Data
public class SignUpRequestDTO {
    private String email;
    private String name;
    private String password;
}
