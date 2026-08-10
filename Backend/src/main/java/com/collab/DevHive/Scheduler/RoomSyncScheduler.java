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

import static com.collab.DevHive.Util.Util.ROOM_CODE_KEY;
import static com.collab.DevHive.Util.Util.ROOM_WHITEBOARD_KEY;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoomSyncScheduler {

    private final StringRedisTemplate redisTemplate;
    private final RoomRepository roomRepository;


    @Scheduled(fixedRate = 30_000)
    @Transactional
    public void syncActiveRoomsToDb() {

        syncCode();
        syncWhiteboard();


    }

    private void syncCode() {
        //yolo consistency
        ScanOptions options = ScanOptions.scanOptions().match(ROOM_CODE_KEY+ "*").count(100).build();

        try (Cursor<byte[]> cursor = redisTemplate.getConnectionFactory()
                .getConnection()
                .scan(options)) {

            while (cursor.hasNext()) {
                String key = new String(cursor.next());



                String roomId = key.replace(ROOM_CODE_KEY, "");
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
        } catch (Exception e) {
            log.error("Sync failed: {}", e.getMessage());
        }
    }

    private void syncWhiteboard(){

        ScanOptions options = ScanOptions.scanOptions().match(ROOM_WHITEBOARD_KEY + "*").count(100).build();

        try (Cursor<byte[]> cursor = redisTemplate.getConnectionFactory()
                .getConnection()
                .scan(options)) {

            while (cursor.hasNext()) {
                String key = new String(cursor.next());
                String roomId = key.replace(ROOM_WHITEBOARD_KEY, "");
                String elements = redisTemplate.opsForValue().get(key);

                if (elements == null) continue;

                roomRepository.findById(roomId).ifPresent(room -> {
                    if (!elements.equals(room.getWhiteboardElements())) {
                        room.setWhiteboardElements(elements);
                        roomRepository.save(room);
                        log.info("Synced whiteboard for room {}", roomId);
                    }
                });
            }
        } catch (Exception e) {
            log.error("Whiteboard sync failed: {}", e.getMessage());
        }

    }
}

