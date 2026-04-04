package com.collab.DevHive.Repositories;

import com.collab.DevHive.Entities.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {



    /**
     * FIX: Pessimistic write lock for joinRoom.
     * Without this, two concurrent join requests can both read size=9,
     * both add a participant, and both save — yielding 11 participants in a
     * room capped at 10. The lock forces them to queue at the DB level.
     */

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.id = :id")
    Optional<Room> findByIdWithLock(@Param("id") String id);

}