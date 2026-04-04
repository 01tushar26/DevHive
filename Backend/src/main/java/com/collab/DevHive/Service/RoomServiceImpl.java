package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.RoomRequestDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;
import com.collab.DevHive.Entities.Enums.RoomsStatus;
import com.collab.DevHive.Entities.Room;
import com.collab.DevHive.Entities.RoomParticipant;
import com.collab.DevHive.Exceptions.ResourceNotFoundException;
import com.collab.DevHive.Exceptions.RoomNotAvailableException;
import com.collab.DevHive.Repositories.RoomParticipantRepository;
import com.collab.DevHive.Repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.collab.DevHive.Util.Util.generateRoomId;

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
    public RoomResponseDto createRoom(RoomRequestDto dto) {
        log.info("Creating room with username : {}",dto.getUserName());

       // ToDo- basically add a user by security later and instead of user name simply set the authenticated user
        Room newRoom = new Room();
        newRoom.setCreatedBy(dto.getUserName());

        newRoom.setStatus(RoomsStatus.ACTIVE);
        newRoom.setCode("// Start coding");

        RoomParticipant roomParticipant = new RoomParticipant();
        roomParticipant.setName(dto.getUserName());
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
    public RoomResponseDto joinRoom(String roomID, String userName) {
        Room room = roomRepository.findByIdWithLock(roomID)
                .orElseThrow(
                        ()->new ResourceNotFoundException("Room is not found with id :"+roomID)
                );


        if (room.getStatus() == RoomsStatus.CLOSED) {
            throw new RoomNotAvailableException("Room " + roomID + " is closed");
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
        //todo- not allowing same name member in a same room at a time



        log.info("Joining the room with id : {}",roomID);

        RoomParticipant roomParticipant = new RoomParticipant();
        roomParticipant.setName(userName);
        room.addParticipant(roomParticipant);
        if (room.getParticipants().size() >= MAX_PARTICIPANTS) {
            room.setStatus(RoomsStatus.FULL);
        }



        room = roomRepository.save(room);
        return mapper.map(room,RoomResponseDto.class);
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

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setCode(dto.getCode());

        roomRepository.save(room);
    }

    @Override
    public RoomResponseDto endRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotAvailableException("Room not found"));

        if(room.getStatus() == RoomsStatus.CLOSED){
            throw new RuntimeException("Room is already closed");
        }
        room.setStatus(RoomsStatus.CLOSED);
       room = roomRepository.save(room);
        return mapper.map(room,RoomResponseDto.class);
    }
}
