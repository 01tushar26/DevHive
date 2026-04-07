package com.collab.DevHive.DTO;

import com.collab.DevHive.Entities.Enums.ParticipantsRoles;
import com.collab.DevHive.Entities.Room;
import com.collab.DevHive.Entities.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
public class ParticipantResponseDto {

    private Long id;
    private Long roomId;
    private User userId;
    private String name;
    private ParticipantsRoles role;
    private LocalDateTime joinedAt;
}

