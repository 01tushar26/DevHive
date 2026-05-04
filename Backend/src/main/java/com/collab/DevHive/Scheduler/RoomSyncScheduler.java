package com.collab.DevHive.Scheduler;

import com.collab.DevHive.Repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoomSyncScheduler {

    private final StringRedisTemplate redisTemplate;
    private final RoomRepository roomRepository;


    @Scheduled(fixedRate = 30_000)
    @Transactional
    public void syncActiveRoomsToDb() {
        ScanOptions options = ScanOptions.scanOptions().match("room:*").count(100).build();

        try (Cursor<byte[]> cursor = redisTemplate.getConnectionFactory()
                .getConnection()
                .scan(options)) {

            while (cursor.hasNext()) {
                String key = new String(cursor.next());

                if (key.contains("::")) continue;

                String roomId = key.replace("room:", "");
                String code = redisTemplate.opsForValue().get(key);

                if (code == null) continue;

                roomRepository.findById(roomId).ifPresent(room -> {
                    if (!code.equals(room.getCode())) {
                        room.setCode(code);
                        roomRepository.save(room);
                        log.info("Updated room {}", roomId);
                    }
                });
            }
        }
         catch (Exception e) {
            log.error("Sync failed: {}", e.getMessage());
        }
    }
}
