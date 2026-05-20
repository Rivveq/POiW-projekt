package com.casino.project.dto.auth;

import com.casino.project.dto.user.UserResponse;

public record LoginResponse(String token, UserResponse user) {}
