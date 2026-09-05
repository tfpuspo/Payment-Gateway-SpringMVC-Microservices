package com.paymentgateway.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// NEW: allows the React dev server to call this service's /graphql endpoint
// directly on :8083 during local development (Vite's default ports).
// In staging/production, browser traffic instead goes through Kong
// (see config/kong.yml's "cors" plugin) — this config only matters
// when hitting auth-service directly, bypassing the gateway.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/graphql")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}