package com.casino.project.dto.games;

import java.util.Map;

public record RouletteBetRequest(
        Map<String, Integer> bets
) {}
