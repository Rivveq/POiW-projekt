package com.casino.project.controller;

import com.casino.project.dto.user.UserRegistrationRequest;
import com.casino.project.dto.user.UserResponse;
import com.casino.project.service.AuthService;
import com.casino.project.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRegistrationRequest request) {
        UserResponse savedUser = userService.registerUser(request);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        String token = authService.authenticateAndGetToken(request.username(), request.password());
        return ResponseEntity.ok(new TokenResponse(token));
    }

    public record LoginRequest(String username, String password) {}
    public record RegisterRequest(String username, String password) {}
    public record TokenResponse(String token) {}
}