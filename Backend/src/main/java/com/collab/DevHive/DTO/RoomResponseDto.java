package com.collab.DevHive.DTO;

import com.collab.DevHive.Entities.Enums.RoomsStatus;
import com.collab.DevHive.Entities.RoomParticipant;
import com.collab.DevHive.Entities.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class RoomResponseDto {

    private String id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String code;
    private UserDTO owner;
    private String ownerUsername;
    private RoomsStatus status;
    private List<RoomParticipant> participants;


}
