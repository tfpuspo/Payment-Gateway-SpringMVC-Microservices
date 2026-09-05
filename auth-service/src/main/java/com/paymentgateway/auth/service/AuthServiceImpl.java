package com.paymentgateway.auth.service;

import com.paymentgateway.auth.entity.AuthPayload;
import com.paymentgateway.auth.entity.User;
import com.paymentgateway.auth.interfaces.AuthService;
import com.paymentgateway.auth.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserStore userStore;
    private final JwtUtil jwtUtil;
    private final RefreshTokenStore refreshTokenStore; // NEW
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthServiceImpl(UserStore userStore, JwtUtil jwtUtil, RefreshTokenStore refreshTokenStore) {
        this.userStore = userStore;
        this.jwtUtil = jwtUtil;
        this.refreshTokenStore = refreshTokenStore;
    }

    @Override
    public AuthPayload register(String email, String password, String name) {
        if (userStore.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        String hash = passwordEncoder.encode(password);
        User user = userStore.save(email, name, hash);
        return issueTokenPair(user); // CHANGED: now issues both tokens
    }

    @Override
    public AuthPayload login(String email, String password) {
        User user = userStore.findByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        return issueTokenPair(user); // CHANGED: now issues both tokens
    }

    // NEW: exchanges a valid refresh token for a fresh access+refresh pair,
    // destroying the old refresh token in the same operation (rotation).
    @Override
    public AuthPayload refreshToken(String refreshToken) {
        String userId = refreshTokenStore.resolveUserId(refreshToken);
        if (userId == null) {
            throw new RuntimeException("Invalid or expired refresh token");
        }
        User user = userStore.findById(userId);
        if (user == null) {
            throw new RuntimeException("User no longer exists");
        }

        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshToken = refreshTokenStore.rotate(refreshToken, user.getId());

        return new AuthPayload(newAccessToken, newRefreshToken, user);
    }

    // NEW: revokes a refresh token, ending that session for good.
    @Override
    public boolean logout(String refreshToken) {
        return refreshTokenStore.revoke(refreshToken);
    }

    @Override
    public User me(String token) {
        String userId = jwtUtil.extractUserId(token);
        return userStore.findById(userId);
    }

    // NEW: shared helper — both register and login issue a fresh token pair the same way.
    private AuthPayload issueTokenPair(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = refreshTokenStore.issue(user.getId());
        return new AuthPayload(accessToken, refreshToken, user);
    }
}
