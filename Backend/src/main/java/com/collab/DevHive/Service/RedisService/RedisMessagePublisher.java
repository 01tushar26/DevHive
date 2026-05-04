package com.collab.DevHive.Service.RedisService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisMessagePublisher {

    private final StringRedisTemplate template;
    private final ChannelTopic topic;

    public void publish(String message) {
        log.debug("Publishing to Redis [{}]: {}", topic.getTopic(), message);
        template.convertAndSend(topic.getTopic(), message);
    }
}
