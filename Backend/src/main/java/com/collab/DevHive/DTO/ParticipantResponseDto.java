package com.collab.DevHive.DTO;

import com.collab.DevHive.Entities.Room;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
public class ParticipantResponseDto {

    private Long id;
    private String name;
    private LocalDateTime joinedAt;
}
