package com.collab.DevHive.Scheduler;

import com.collab.DevHive.Repositories.RoomRepository;
import com.collab.DevHive.Service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoomSyncScheduler {

    private final RedisTemplate<String, String> redisTemplate;
    private final RoomRepository roomRepository;


    @Scheduled(fixedRate = 30_000)
    @Transactional
    public void syncActiveRoomsToDb() {
        ScanOptions options = ScanOptions.scanOptions().match("room:*").count(100).build();

        try (Cursor<String> cursor = redisTemplate.scan(options)) {

            while (cursor.hasNext()) {
                String key = cursor.next();

                if (key.contains("::")) continue; // skip Spring Cache keys

                String roomId = key.replace("room:", "");
                String code   = redisTemplate.opsForValue().get(key);

                if (code == null) continue;

                roomRepository.findById(roomId).ifPresent(room -> {
                    if (!code.equals(room.getCode())) {  // skip write if code unchanged
                        room.setCode(code);
                        roomRepository.save(room);
                    }
                });
                log.info("Code updated in db succesfully");
            }
        } catch (Exception e) {
            log.error("Sync failed: {}", e.getMessage());
        }
    }
}
