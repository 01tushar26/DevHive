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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.collab.DevHive.Util.Util.generateRoomId;
import static com.collab.DevHive.Util.Util.getAuthenticatedUser;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{

    private final RoomRepository roomRepository;
    private final ModelMapper mapper;

    private static final int MAX_PARTICIPANTS = 10;
    private static final int MAX_RETRY_ATTEMPTS = 3;


    @Override
    @Transactional
    public RoomResponseDto createRoom(RoomRequestDto dto ) {
        User currentUser = getAuthenticatedUser();

        log.info("Creating room with owner : {}",dto.getUserName());
        Room newRoom = new Room();
        newRoom.setOwner(currentUser);

       //Todo-later in a room a user can changed its name
//        newRoom.setOwnerUsername(currentUser.getName());
        newRoom.setStatus(RoomsStatus.ACTIVE);
        newRoom.setCode("// Start coding");

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
    public LeaveJoinRoomResponseDto joinRoom(String roomID, String userName) {
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
        RoomEventDto eventDto = new RoomEventDto(currentUser.getName(),currentUser.getId(),"USER_JOIN");
        return new LeaveJoinRoomResponseDto(mapper.map(room,RoomResponseDto.class),eventDto);
    }

    @Override
    public RoomResponseDto getRoom(String roomId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        return mapper.map(room,RoomResponseDto.class);
    }


    @Override
    @Transactional
    public void updateCode(String roomId, UpdateCodeRequestDto dto) {

//        User currentUser = getAuthenticatedUser();

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        //first check whether the user is a member of room or not
//        RoomParticipant participant = room
//                .getParticipants().stream()
//                        .filter(p->p.getUser().getId().equals(currentUser.getId()))
//                                .findFirst().orElseThrow(()->new AccessDeniedException("You re not the member of the room"));
//        //then check whether the user is Join as view only or not
//        if (participant.getRole() == ParticipantsRoles.VIEWER) {
//            throw new AccessDeniedException("Viewers cannot edit code");
//        }
        room.setCode(dto.getCode());

        roomRepository.save(room);
    }

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

       //todo-add if the user is not the owner then it left the room

        if(participant.getRole() != ParticipantsRoles.OWNER){
            throw new AccessDeniedException("You re not the member of the room");
        }


        room.setStatus(RoomsStatus.CLOSED);
        room = roomRepository.save(room);
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
        room = roomRepository.save(room);

        RoomEventDto eventDto = new RoomEventDto(currentUser.getName(),currentUser.getId(),"USER_LEFT");
        return new LeaveJoinRoomResponseDto(mapper.map(room,RoomResponseDto.class),eventDto);

    }

}
