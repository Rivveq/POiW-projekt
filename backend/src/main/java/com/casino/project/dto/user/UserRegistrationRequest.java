package com.casino.project.dto.user;

import jakarta.validation.constraints.*;

public record UserRegistrationRequest(
        @NotBlank @Size(min = 4, max = 20) String username,
        @NotBlank @Size(min = 8) String password
) {}