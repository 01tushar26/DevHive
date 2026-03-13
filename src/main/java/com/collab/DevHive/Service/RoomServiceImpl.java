package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.RoomResponseDto;
import com.collab.DevHive.Entities.Enums.RoomsStatus;
import com.collab.DevHive.Entities.Room;
import com.collab.DevHive.Repositories.RoomParticipantRepository;
import com.collab.DevHive.Repositories.RoomRepository;
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
    public RoomResponseDto createRoom(String username) {
        log.info("Creating room with username : {}",username);

       // ToDo- basically add a user by security later and instead of user name simply set the authenticated user
        Room newRoom = new Room();
        newRoom.setCreatedBy(username);
        newRoom.setId(generateRoomId());
        newRoom.setStatus(RoomsStatus.ACTIVE);



    }
}
