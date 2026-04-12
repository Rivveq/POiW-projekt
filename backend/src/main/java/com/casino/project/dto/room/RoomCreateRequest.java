package com.casino.project.dto.room;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record RoomCreateRequest(
        @NotBlank(message = "Room name is required")
        @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
        String name,

        @Min(value = 1, message = "Capacity must be at least 1")
        @Max(value = 20, message = "Capacity cannot exceed 20")
        int capacity,

        @NotNull(message = "Minimum bet is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Minimum bet cannot be negative")
        BigDecimal minBet
) {}