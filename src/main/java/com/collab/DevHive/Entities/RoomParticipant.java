package com.collab.DevHive.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "room_participant")
public class RoomParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //ownner side
    @ManyToOne
    @JoinColumn(name = "room_id" , nullable = false)
    private Room room;

    @Column(nullable = false)
    private String name;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime joinedAt;
}