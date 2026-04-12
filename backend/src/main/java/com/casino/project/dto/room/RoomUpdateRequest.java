package com.casino.project.dto.room;

import jakarta.validation.constraints.*;

public record RoomUpdateRequest(
        @NotBlank(message = "Room name is required")
        @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
        String name,

        @Min(value = 1, message = "Capacity must be at least 1")
        int capacity
) {}