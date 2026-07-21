package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.*;
import com.collab.DevHive.Entities.Enums.ParticipantsRoles;
import com.collab.DevHive.Entities.Enums.RoomsStatus;
import com.collab.DevHive.Entities.Room;
import com.collab.DevHive.Entities.RoomParticipant;
import com.collab.DevHive.Entities.User;
import com.collab.DevHive.Exceptions.AlreadyExistException;
import com.collab.DevHive.Exceptions.ResourceNotFoundException;
import com.collab.DevHive.Exceptions.RoomNotAvailableException;
import com.collab.DevHive.Repositories.RoomParticipantRepository;
import com.collab.DevHive.Repositories.RoomRepository;
import com.collab.DevHive.Util.Util;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

import static com.collab.DevHive.Util.Util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{

    private final RoomRepository roomRepository;
    private final ModelMapper mapper;
    private final StringRedisTemplate redisTemplate;
    private final LiveKitService liveKitService;





    @Override
    @Transactional
    public RoomResponseDto createRoom() {
        User currentUser = getAuthenticatedUser();

        log.info("Creating room with owner : {}",currentUser.getName());
        Room newRoom = new Room();
        newRoom.setOwner(currentUser);

       //Todo-later in a room a user can changed its name
//        newRoom.setOwnerUsername(currentUser.getName());
        newRoom.setStatus(RoomsStatus.ACTIVE);
        newRoom.setCode("// Start coding");
        newRoom.setLanguage("javascript");
        RoomParticipant roomParticipant = new RoomParticipant();
        roomParticipant.setUser(currentUser);
        roomParticipant.setRole(ParticipantsRoles.OWNER);
        roomParticipant.setName(currentUser.getName());
        newRoom.addParticipant(roomParticipant);

        // FIX: Retry on ID collision instead of blindly saving
        for (int attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
            try {
                newRoom.setId(generateRoomId());
                newRoom = roomRepository.save(newRoom);
                log.info("Room created with id: {}", newRoom.getId());

                //put it into redis
                seedRedis(newRoom.getId(),newRoom.getCode());
                return mapper.map(newRoom,RoomResponseDto.class);
            } catch (DataIntegrityViolationException e) {
                log.warn("Room ID collision on attempt {}, retrying...", attempt + 1);
                if (attempt == MAX_RETRY_ATTEMPTS - 1) {
                    throw new RuntimeException("Failed to generate a unique room ID after " + MAX_RETRY_ATTEMPTS + " attempts", e);
                }
            }
        }
        throw new RuntimeException("Unexpected error during room creation");



    }
    @Override
    @Transactional
    public LeaveJoinRoomResponseDto joinRoom(String roomID) {
        User currentUser = getAuthenticatedUser();

        Room room = roomRepository.findByIdWithLock(roomID)
                .orElseThrow(
                        ()->new ResourceNotFoundException("Room is not found with id :"+roomID)
                );

        if (room.getStatus() == RoomsStatus.CLOSED) {
            throw new RoomNotAvailableException("Room " + roomID + " is closed");
        }

        RoomParticipant participant = room.getParticipants()
                .stream()
                .filter(p->p.getUser().getId().equals(currentUser.getId()))
                .findFirst()
                .orElse(null);

        if(participant != null){
            ensureRedisSeeded(roomID,room.getCode());
            RoomEventDto eventDto = new RoomEventDto(currentUser.getName(),currentUser.getId(),"USER_REJOIN");
            return new LeaveJoinRoomResponseDto(mapper.map(room,RoomResponseDto.class),eventDto);
        }



        if (room.getStatus() == RoomsStatus.FULL) {
            throw new RoomNotAvailableException("Room " + roomID + " is full");
        }
        // this is checked before what if two people join at same time
        if(room.getParticipants().size()>=MAX_PARTICIPANTS){
            room.setStatus(RoomsStatus.FULL);
            roomRepository.save(room);
            throw new RoomNotAvailableException("Room " + roomID + " is full");
        }




        log.info("Joining the room with id : {}",roomID);

        RoomParticipant roomParticipant = new RoomParticipant();
        roomParticipant.setUser(currentUser);
        roomParticipant.setName(currentUser.getName());
        roomParticipant.setRole(ParticipantsRoles.EDITOR);
        room.addParticipant(roomParticipant);

        if (room.getParticipants().size() >= MAX_PARTICIPANTS) {
            room.setStatus(RoomsStatus.FULL);
        }

        room = roomRepository.save(room);

        ensureRedisSeeded(roomID,room.getCode());
        RoomEventDto eventDto = new RoomEventDto(currentUser.getName(),currentUser.getId(),"USER_JOIN");
        return new LeaveJoinRoomResponseDto(mapper.map(room,RoomResponseDto.class),eventDto);
    }

    @Override
    public RoomResponseDto getRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // if the new user before 30 second db will not updated yet
        String liveCode = redisTemplate.opsForValue().get(ROOM_CODE_KEY + roomId);
        if (liveCode != null) {
            room.setCode(liveCode);  // override stale DB code with live Redis value
        }

        return mapper.map(room, RoomResponseDto.class);
    }


//    @Override
//    @Transactional
//    public void updateCode(String roomId, String code) {
//
//
//
//        Room room = roomRepository.findById(roomId)
//                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
//
//        room.setCode(code);
//
//        roomRepository.save(room);
//        log.debug("Periodic DB sync done for room: {}", roomId);
//    }

    @Override
    @Transactional
    public RoomResponseDto endRoom(String roomId) {

        User currentUser = getAuthenticatedUser();

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotAvailableException("Room not found"));
        if(room.getStatus() == RoomsStatus.CLOSED){
            throw new RuntimeException("Room is already closed");
        }
        //first check whether the user is a member of room or not
        RoomParticipant participant = room
                .getParticipants().stream()
                .filter(p->p.getUser().getId().equals(currentUser.getId()))
                .findFirst().orElseThrow(()->new AccessDeniedException("You re not the member of the room"));



        if(participant.getRole() != ParticipantsRoles.OWNER){
            throw new AccessDeniedException("You cannot end the room pls leave the room ");
        }
        //make sure that the code has been updated in db
        String latestCode = redisTemplate.opsForValue().get(ROOM_CODE_KEY + roomId);

        if (latestCode != null) {
            room.setCode(latestCode);
            log.info("Final code synced from Redis to DB for room: {}", roomId);
        }
        else {
            log.warn("Redis miss on room close for room: {} — DB may have stale code. " +
                    "Redis may have evicted the key or restarted.", roomId);
        }


        room.setStatus(RoomsStatus.CLOSED);
        room = roomRepository.save(room);

        redisTemplate.delete(ROOM_CODE_KEY + roomId);
        log.info("Redis key deleted for closed room: {}", roomId);
        //this will delete the livekit vc rooom if exist
        liveKitService.closeVideoCall(roomId);

        return mapper.map(room,RoomResponseDto.class);
    }

    @Override
    @Transactional
    public LeaveJoinRoomResponseDto leaveRoom(String roomId) {

        log.info("Leaving the room with id: {}",roomId);

        User currentUser = getAuthenticatedUser();
        Room room = roomRepository.findById(roomId).orElseThrow(
                ()->new ResourceNotFoundException("Room is Not found with id "+roomId)
        );

        if(room.getStatus() == RoomsStatus.CLOSED){
            throw new RuntimeException("Room is not active");
        }
        //first check whether the user is a member of room or not
        RoomParticipant participant = room.getParticipants().stream()
                .filter(roomParticipant -> roomParticipant.getUser().getId().equals(currentUser.getId()))
                .findFirst()
                .orElseThrow(()->new AccessDeniedException("You are not a member of this room"));

        if(participant.getRole() == ParticipantsRoles.OWNER){
            throw new AccessDeniedException("Owner cannot leave the room. Use the end room API instead.");
        }

        room.getParticipants().remove(participant);

        if (room.getStatus() == RoomsStatus.FULL && room.getParticipants().size() < MAX_PARTICIPANTS) {
            room.setStatus(RoomsStatus.ACTIVE);
        }

        room = roomRepository.save(room);
        liveKitService.removeParticipant(roomId, currentUser.getEmail());

        RoomEventDto eventDto = new RoomEventDto(currentUser.getName(),currentUser.getId(),"USER_LEFT");
        return new LeaveJoinRoomResponseDto(mapper.map(room,RoomResponseDto.class),eventDto);

    }

    @Override
    public void langUpdate(String roomId, String language) {
        Room room = roomRepository.findById(roomId).orElseThrow(()->new ResourceNotFoundException("Room is not found with id "+roomId));
        room.setLanguage(language);
        roomRepository.save(room);
    }

    // basically to put the code in redis
    private void seedRedis(String roomId, String code) {
        redisTemplate.opsForValue().set(
                ROOM_CODE_KEY + roomId,
                code,
                ROOM_TTL_HOURS,
                TimeUnit.HOURS
        );
        log.debug("Redis seeded for room: {}", roomId);
    }
    //ensure whether the server didnot restart cache didnot get clean
    private void ensureRedisSeeded(String roomId, String code) {
        String key = ROOM_CODE_KEY + roomId;

        if (Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.opsForValue().set(key, code, ROOM_TTL_HOURS, TimeUnit.HOURS);
            log.debug("Redis re-seeded after miss for room: {}", roomId);
        }
    }

}
