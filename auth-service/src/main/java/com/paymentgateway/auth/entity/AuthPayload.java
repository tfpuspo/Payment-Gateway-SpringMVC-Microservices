package com.paymentgateway.auth.entity;

public class AuthPayload {
    private String accessToken;   // CHANGED: was "token"
    private String refreshToken;  // NEW
    private User user;

    public AuthPayload(String accessToken, String refreshToken, User user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public User getUser() { return user; }
}
