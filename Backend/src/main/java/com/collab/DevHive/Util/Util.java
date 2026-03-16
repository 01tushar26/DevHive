package com.collab.DevHive.Util;

import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

@Slf4j
public final class  Util {

    public static String generateRoomId(){
        log.info("Generating  room id");
        return UUID.randomUUID().toString().substring(0, 8);
    }

}
