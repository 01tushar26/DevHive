package com.collab.DevHive.DTO;

import com.collab.DevHive.Entities.Enums.RoomsStatus;
import com.collab.DevHive.Entities.RoomParticipant;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoomResponseDto {

    private String id;
    private LocalDateTime createdAt;
    private String code;
    private String createdBy;
    private RoomsStatus status;
    private List<ParticipantResponseDto> participants;
}
