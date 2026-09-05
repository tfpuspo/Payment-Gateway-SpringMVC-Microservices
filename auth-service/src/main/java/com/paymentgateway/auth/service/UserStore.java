package com.paymentgateway.auth.service;

import com.paymentgateway.auth.entity.User;
import com.paymentgateway.auth.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserStore {

    private final UserRepository userRepository;

    public UserStore(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(String email, String name, String passwordHash) {
        String id = UUID.randomUUID().toString();
        User user = new User(id, email, name, passwordHash);
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}