package com.paymentgateway.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // TODO: move this to an environment variable before this ever leaves local dev.
    // MUST exactly match the "secret" value under consumers.jwt_secrets in kong.yml
    private final Key key = Keys.hmacShaKeyFor(
            "this-is-a-placeholder-secret-change-me-32bytes".getBytes());

    // CHANGED: access tokens are now short-lived (15 minutes, was 1 hour).
    // This is deliberate — a stolen access token is only dangerous for a
    // short window. The refresh token (in Redis, revocable) is what
    // provides the long-lived session now, not the JWT itself.
    private static final long ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

    // MUST exactly match the "key" value under consumers.jwt_secrets in kong.yml —
    // this is how Kong knows WHICH consumer's secret to check a given token against.
    private static final String ISSUER = "auth-service-issuer";

    // CHANGED: renamed from generateToken() to generateAccessToken() to make
    // the distinction from refresh tokens explicit throughout the codebase.
    public String generateAccessToken(String userId, String email) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuer(ISSUER)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRY_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
