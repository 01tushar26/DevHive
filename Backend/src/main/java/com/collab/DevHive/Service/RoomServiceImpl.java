package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.RoomRequestDto;
import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.DTO.UpdateCodeRequestDto;
import com.collab.DevHive.Entities.Enums.RoomsStatus;
import com.collab.DevHive.Entities.Room;
import com.collab.DevHive.Entities.RoomParticipant;
import com.collab.DevHive.Exceptions.ResourceNotFoundException;
import com.collab.DevHive.Repositories.RoomParticipantRepository;
import com.collab.DevHive.Repositories.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import static com.collab.DevHive.Util.Util.generateRoomId;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{
    private final RoomParticipantRepository roomParticipantRepository;
    private final RoomRepository roomRepository;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public RoomResponseDto createRoom(RoomRequestDto dto) {
        log.info("Creating room with username : {}",dto.getUserName());

       // ToDo- basically add a user by security later and instead of user name simply set the authenticated user
        Room newRoom = new Room();
        newRoom.setCreatedBy(dto.getUserName());
        newRoom.setId(generateRoomId());
        newRoom.setStatus(RoomsStatus.ACTIVE);
        newRoom.setCode("// Start coding");

        RoomParticipant roomParticipant = new RoomParticipant();
        roomParticipant.setName(dto.getUserName());
        newRoom.addParticipant(roomParticipant);

       newRoom= roomRepository.save(newRoom);
        log.info("Room is created  with id : {}",newRoom.getId());
        return mapper.map(newRoom,RoomResponseDto.class);
    }
    @Override
    @Transactional
    public RoomResponseDto joinRoom(String roomID) {
        Room room = roomRepository.findById(roomID)
                .orElseThrow(
                        ()->new ResourceNotFoundException("Room is not found with id :"+roomID)
                );


        if(room.getStatus() == RoomsStatus.CLOSED || room.getStatus() == RoomsStatus.FULL){
            throw new RuntimeException("Cannot Join the room with id"+room.getId());
        }
        //todo- not aloowing same name member in a same room at a time

        log.info("Joining the room with id : {}",roomID);

        RoomParticipant roomParticipant = new RoomParticipant();
        roomParticipant.setName("Anthony");
        room.addParticipant(roomParticipant);

        if(room.getParticipants().size()==10){
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
    public void updateCode(String roomId, UpdateCodeRequestDto dto) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setCode(dto.getCode());

        roomRepository.save(room);
    }

    @Override
    public RoomResponseDto endRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if(room.getStatus() == RoomsStatus.CLOSED){
            throw new RuntimeException("Room is already closed");
        }
        room.setStatus(RoomsStatus.CLOSED);
       room = roomRepository.save(room);
        return mapper.map(room,RoomResponseDto.class);
    }

}
