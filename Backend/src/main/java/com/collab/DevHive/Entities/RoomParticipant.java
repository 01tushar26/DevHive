package com.collab.DevHive.Entities;

import com.collab.DevHive.Entities.Enums.ParticipantsRoles;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "room_participant",
uniqueConstraints = @UniqueConstraint(columnNames = {"room_id","user_id"}))
public class RoomParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //owner side(in which the join column exist)
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "room_id" , nullable = false)
    private Room room;

    //owner side(in which the join column exist)
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "user_id" , nullable = false)
    private User user;

    @Column(name = "participant_name")
    private String name;

    @Enumerated(EnumType.STRING)
    private ParticipantsRoles role;


    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime joinedAt;
}