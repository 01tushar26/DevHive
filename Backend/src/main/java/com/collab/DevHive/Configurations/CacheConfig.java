package com.collab.DevHive.Configurations;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {

//    @Bean
    // this is already provided by the spring itself
//    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
//
//        RedisTemplate<String, String> template = new RedisTemplate<>();
//        template.setConnectionFactory(connectionFactory);
//        template.setKeySerializer(new StringRedisSerializer());
//        template.setValueSerializer(new StringRedisSerializer());
//        template.setHashKeySerializer(new StringRedisSerializer());
//        template.setHashValueSerializer(new StringRedisSerializer());
//        template.afterPropertiesSet();
//        return template;
//    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory){
        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .prefixCacheNameWith("devhive-redis")
                .entryTtl(Duration.ofSeconds(30))
                .enableTimeToIdle();

                return RedisCacheManager.builder(connectionFactory).cacheDefaults(redisCacheConfiguration).build();
    }
}
