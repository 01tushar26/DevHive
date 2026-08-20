package com.collab.DevHive.Service;

import com.collab.DevHive.DTO.JoinVideoCallResponseDTO;
import com.collab.DevHive.Entities.Enums.ParticipantsRoles;
import com.collab.DevHive.Entities.Enums.RoomsStatus;
import com.collab.DevHive.Entities.Room;
import com.collab.DevHive.Entities.RoomParticipant;
import com.collab.DevHive.Entities.User;
import com.collab.DevHive.Exceptions.ResourceNotFoundException;
import com.collab.DevHive.Exceptions.RoomNotAvailableException;
import com.collab.DevHive.Repositories.RoomRepository;
import io.livekit.server.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import static com.collab.DevHive.Util.Util.getAuthenticatedUser;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveKitServiceImpl implements LiveKitService {

    private final RoomServiceClient roomServiceClient;
    private final RoomRepository roomRepo;

    @Value("${livekit.api-key}")
    private String apiKey;

    @Value("${livekit.api-secret}")
    private String apiSecret;

    @Value("${livekit.server-url}")
    private String serverUrl;


    @Override
    @Transactional
    public JoinVideoCallResponseDTO videoCallRequest(String roomId)  {


        User currentUser = getAuthenticatedUser();
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if(room.getStatus() == RoomsStatus.CLOSED){
            throw new RoomNotAvailableException("Room is no longer active");
        }

        //first check whether the user is a member of room or not

           RoomParticipant roomParticipant = room
                .getParticipants().stream()
                .filter(p->p.getUser().getId().equals(currentUser.getId()))
                .findFirst().orElseThrow(()->new AccessDeniedException("You are not a member of this room"));

           boolean isOwner = roomParticipant.getRole().equals(ParticipantsRoles.OWNER);

           try {
               roomServiceClient.createRoom(
                               roomId,
                               600,
                               20)
                       .execute();
           }
           catch (Exception e){
               throw new RuntimeException("Failed to create room ");
           }



        if (!room.isVcActive()) {
            room.setVcActive(true);
            roomRepo.save(room);
        }


        AccessToken token = new AccessToken(apiKey,apiSecret);
        token.setIdentity(currentUser.getEmail());
        token.setName(currentUser.getName());
        if(isOwner){
            token.addGrants(new RoomJoin(true), new RoomName(roomId),new RoomAdmin(true));
        }
        else {
            token.addGrants(new RoomJoin(true), new RoomName(roomId));
        }

        token.setExpiration(Date.from(Instant.now().plus(Duration.ofHours(2))));

        String jwt = token.toJwt();
        String wsURL = serverUrl.replaceFirst("https","ws");
        return new JoinVideoCallResponseDTO(wsURL,jwt);
    }

    @Override
    public void closeVideoCall(String roomId)  {
        try {
          roomServiceClient.deleteRoom(roomId).execute();
          log.info("LiveKit room closed for roomId: {}", roomId);
        }
        catch (Exception e){
            log.warn("Could not LiveKit room closed for roomId{}: {}", roomId,e.getMessage());

        }finally {
            roomRepo.findById(roomId).ifPresent(room -> {
                room.setVcActive(false);
                roomRepo.save(room);
            });
        }
    }

    @Override
    public void removeParticipant(String roomId, String identity) {

       try {
           roomServiceClient.removeParticipant(roomId,identity).execute();
           log.info("Removed participant {} from LiveKit room {}", identity, roomId);
       }
       catch (Exception e){
           log.warn("Could not remove participant {} from LiveKit room {}: {}", identity, roomId, e.getMessage());
       }
    }
}
