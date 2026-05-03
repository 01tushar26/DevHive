package com.collab.DevHive.Util;

import com.collab.DevHive.Entities.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

@Slf4j
public final class  Util {

    public static String generateRoomId(){
        log.info("Generating  room id");
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public static User getAuthenticatedUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return (User) auth.getPrincipal();
    }
    public static final String ROOM_CODE_KEY = "room:";
    public static final long ROOM_TTL_HOURS = 2;
    public static final int MAX_PARTICIPANTS = 10;
    public static final int MAX_RETRY_ATTEMPTS = 3;

}
