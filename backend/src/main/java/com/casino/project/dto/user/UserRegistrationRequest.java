package com.casino.project.dto.user;

import jakarta.validation.constraints.*;

public record UserRegistrationRequest(
        @NotBlank(message = "Login nie może być pusty") @Size(min = 4, max = 20) String username,
        @NotBlank(message = "Hasło nie może być puste") @Size(min = 8, message = "Hasło musi mieć minimum 8 znaków") String password
) {}