package com.collab.DevHive.Entities;

import com.collab.DevHive.Entities.Enums.RoomsStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Room {

    @Id
    @Column(length = 20)
    private String id;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "TEXT")
    private String code;

    @Column(nullable = false)
    private String createdBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomsStatus status;

    //inverse side
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true , fetch = FetchType.LAZY)
    private List<RoomParticipant> participants =  new ArrayList<>();

    public void addParticipant(RoomParticipant participant){
        participants.add(participant);
        participant.setRoom(this);
    }

}
