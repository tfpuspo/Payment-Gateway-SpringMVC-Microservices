package com.paymentgateway.auth.interfaces;

import com.paymentgateway.auth.entity.AuthPayload;
import com.paymentgateway.auth.entity.User;

public interface AuthService {
    AuthPayload register(String email, String password, String name);
    AuthPayload login(String email, String password);
    AuthPayload refreshToken(String refreshToken); // NEW: rotates a refresh token
    boolean logout(String refreshToken);            // NEW: revokes a refresh token
    User me(String token);
}
