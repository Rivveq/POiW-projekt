package com.casino.project.dto.user;

public record UserResponse(
        Long id,
        String username,
        String role
) {}