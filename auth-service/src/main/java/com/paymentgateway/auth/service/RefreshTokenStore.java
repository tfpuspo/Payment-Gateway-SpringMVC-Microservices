package com.paymentgateway.auth.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

@Component
public class RefreshTokenStore {

    // Redis key prefix — keeps this separate from Kong's own rate-limit
    // keys in the same Redis instance (different namespace, no collision).
    private static final String KEY_PREFIX = "auth:refresh:";
    private static final Duration TTL = Duration.ofDays(7);

    private final StringRedisTemplate redisTemplate;

    public RefreshTokenStore(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Issues a brand new refresh token for a user and stores it in Redis
     * with a 7-day expiry. The token itself is a random opaque string —
     * it carries no data, it's purely a lookup key.
     */
    public String issue(String userId) {
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(KEY_PREFIX + token, userId, TTL);
        return token;
    }

    /**
     * Looks up which user a refresh token belongs to.
     * Returns null if the token doesn't exist or has expired —
     * both cases Redis handles automatically via TTL.
     */
    public String resolveUserId(String token) {
        return redisTemplate.opsForValue().get(KEY_PREFIX + token);
    }

    /**
     * Rotation: destroys the old token and issues a brand new one.
     * This is called every time a client refreshes — even if an attacker
     * later replays the OLD token, it's already gone from Redis.
     */
    public String rotate(String oldToken, String userId) {
        redisTemplate.delete(KEY_PREFIX + oldToken);
        return issue(userId);
    }

    /**
     * Logout: explicitly destroys a refresh token, ending that session
     * for good. This is the one thing a pure stateless JWT can never do.
     */
    public boolean revoke(String token) {
        Boolean deleted = redisTemplate.delete(KEY_PREFIX + token);
        return Boolean.TRUE.equals(deleted);
    }
}
