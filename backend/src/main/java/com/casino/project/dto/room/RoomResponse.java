package com.casino.project.dto.room;

import java.util.List;

public record RoomResponse(
        Long id,
        String name,
        int capacity,
        int currentPlayersCount,
        List<String> playerNames
) {}