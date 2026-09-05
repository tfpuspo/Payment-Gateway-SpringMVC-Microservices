package com.paymentgateway.auth.resolver;

import com.paymentgateway.auth.entity.AuthPayload;
import com.paymentgateway.auth.entity.User;
import com.paymentgateway.auth.interfaces.AuthService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class AuthResolver {

    private final AuthService authService;

    public AuthResolver(AuthService authService) {
        this.authService = authService;
    }

    @MutationMapping
    public AuthPayload register(@Argument String email, @Argument String password, @Argument String name) {
        return authService.register(email, password, name);
    }

    @MutationMapping
    public AuthPayload login(@Argument String email, @Argument String password) {
        return authService.login(email, password);
    }

    // NEW
    @MutationMapping
    public AuthPayload refreshToken(@Argument String refreshToken) {
        return authService.refreshToken(refreshToken);
    }

    // NEW
    @MutationMapping
    public Boolean logout(@Argument String refreshToken) {
        return authService.logout(refreshToken);
    }

    @QueryMapping
    public User me(@Argument String token) {
        return authService.me(token);
    }
}
